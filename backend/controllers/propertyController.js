
import { Property } from '../models/Property.js';
import User from '../models/User.js';
import sanitize from 'mongo-sanitize';
import mongoose from 'mongoose';

export const getAllProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      state_district,
      propertyType,
      minPrice,
      maxPrice,
      bed,
      bathMin,
      minSqft,
      maxSqft,
      keyword,
      sort,
    } = req.query;

    const query = { isActive: true ,status: 'available', };

    if (state_district) {
      query['location.state_district'] = { $regex: state_district, $options: 'i' };
    }

    if (propertyType) {
      query.propertyType = propertyType.toLowerCase(); 
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
          query.price.$gte = min;
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
          query.price.$lte = max;
        }
      }
    }

    if (bed) {
      const bedNum = parseInt(bed.replace('+', '')); 
      if (!isNaN(bedNum)) {
        query.$and = [
          { propertyType: { $in: ['apartment', 'villa'] } }, 
          { bedrooms: { $gte: bedNum } },
        ];
      }
    }

    if (bathMin) {
      const bathNum = parseInt(bathMin.replace('+', '')); 
      if (!isNaN(bathNum)) {
        query.$and = query.$and || [];
        query.$and.push(
          { propertyType: { $in: ['apartment', 'villa'] } },
          { bathrooms: { $gte: bathNum } }
        );
      }
    }

    if (minSqft || maxSqft) {
      query.sqft = {};
      if (minSqft) {
        const min = parseInt(minSqft);
        if (!isNaN(min)) {
          query.sqft.$gte = min;
        }
      }
      if (maxSqft) {
        const max = parseInt(maxSqft);
        if (!isNaN(max)) {
          query.sqft.$lte = max;
        }
      }
    }

    if (keyword) {
      const sanitizedKeyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$text = { $search: sanitizedKeyword };
    }

    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split(':');
      if (['price', 'createdAt', 'bedrooms', 'bathrooms', 'sqft'].includes(field)) {
        sortOption[field] = order === 'desc' ? -1 : 1;
      }
    } else {
      sortOption.createdAt = -1; 
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Property.countDocuments(query);

    res.status(200).json({
      properties,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error getting properties:', error);
    next(error);
  }
};
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('agentId','name email profilePic phone');

    if (!property || !property.isActive) {
      return res.status(404).json({ message: 'Property not found or not active' });
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
}
};

export const getPropertyRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property || !property.isActive) {
      return res.status(404).json({ message: 'Property not found or not active' });
    }

    const { address, price, type, propertyType } = property;
    const query = {
      _id: { $ne: id },
      isActive: true,
      type,
      address: { $regex: address.split(',')[0], $options: 'i' },
      price: { $gte: price * 0.8, $lte: price * 1.2 },
      propertyType,
    };

    const recommendations = await Property.find(query).limit(5).sort({ views: -1 });
    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.wishlist.filter(property => property.isActive));
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({ message: 'Property not found or not active' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.wishlist.includes(propertyId)) {
      user.wishlist.push(propertyId);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.wishlist = user.wishlist.filter(id => id.toString() !== propertyId);
    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getPropertyImagesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 4 } = req.query;

    const categoryMap = {
      commercial: 'commercial',
      'shop-showroom': 'commercial',
      industrial: 'commercial',
      apartment: 'apartment',
      house: 'villa',
      land: 'plot',
    };

    const properties = await Property.find({
      propertyType: categoryMap[category.toLowerCase()] || category,
      isActive: true,
      images: { $exists: true, $not: { $size: 0 } },
    })
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .select('images');

    const images = properties.flatMap(property => property.images.slice(0, 1));
    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ isActive: true })
      .sort({ views: -1 })
      .limit(8)
      .select('name price images address propertyType bedrooms bathrooms sqft');

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const searchProperties = async (req, res, next) => {
  try {
    const {
      state_district = '',
      propertyType,
      page = 1,
      limit = 10,
    } = req.query;

    if (!state_district && !propertyType) {
      return res.status(400).json({ message: 'State district or property type required' });
    }

    const query = { isActive: true };

    if (state_district) {
      query['location.state_district'] = { $regex: sanitize(state_district), $options: 'i' };
    }

    if (propertyType) {
      const typeMap = {
        apartment: 'apartment',
        house: 'villa',
        land: 'plot',
        hostel: 'hostel',
      };
      query.propertyType = typeMap[propertyType.toLowerCase()] || sanitize(propertyType);
    }

    const properties = await Property.find(query)
      .select('name price images address propertyType bedrooms bathrooms sqft status location.placeName location.state_district')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    if (properties.length > 0) {
      await Property.updateMany(
        { _id: { $in: properties.map(p => p._id) } },
        { $inc: { views: 1 } }
      );
    }

    const total = await Property.countDocuments(query);
    res.status(200).json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Search properties error:', error);
    next(error);
  }
};

export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { state_district = '', propertyType } = req.query;

    if (!state_district) {
      return res.status(400).json({ message: 'State district required for suggestions' });
    }

    const query = {
      'location.state_district': { $regex: sanitize(state_district), $options: 'i' },
      isActive: true,
    };

    if (propertyType) {
      const typeMap = {
        apartment: 'apartment',
        house: 'villa',
        land: 'plot',
        hostel: 'hostel',
      };
      query.propertyType = typeMap[propertyType.toLowerCase()] || sanitize(propertyType);
    }

    const suggestions = await Property.distinct('location.state_district', query);

    const filteredSuggestions = suggestions
      .filter(district => district && district.toLowerCase().includes(state_district.toLowerCase()))
      .slice(0, 5);

    res.status(200).json(filteredSuggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    next(error);
  }
};