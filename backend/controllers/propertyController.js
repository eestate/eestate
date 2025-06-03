

import Property from '../models/Property.js';
import User from '../models/User.js';


export const getAllProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, location, minPrice, maxPrice, propertyType, for: type, keyword } = req.query;
    const query = { isActive: true };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (propertyType) {
      query.category = { $regex: propertyType, $options: 'i' };
    }
    if (type) {
      query.type = type === 'buy' ? 'sale' : type;
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    await Promise.all(
      properties.map(property =>
        Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } }, { new: true })
      )
    );

    const total = await Property.countDocuments(query);
    res.status(200).json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property || !property.isActive) {
      return res.status(404).json({ message: 'Property not found or not active' });
    }
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

// Get property recommendations
export const getPropertyRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property || !property.isActive) {
      return res.status(404).json({ message: 'Property not found or not active' });
    }

    const { location, price, type } = property;
    const query = {
      _id: { $ne: id }, // Exclude the current property
      isActive: true,
      type,
      location: { $regex: location.split(',')[0], $options: 'i' }, // Match city or first part
      price: { $gte: price * 0.8, $lte: price * 1.2 }, // ±20% price range
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