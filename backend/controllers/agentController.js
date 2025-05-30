import Property from '../models/Property.js';
import cloudinary from '../config/cloudinary.js';

export const createProperty = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can create properties' });
    }

    const existingProperties = await Property.countDocuments({ listedBy: req.user._id });
    if (existingProperties > 0 && !req.user.isSubscribed) {
      return res.status(403).json({ message: 'Free property limit reached. Subscribe to add more.' });
    }

    const { title, description, price, type, category, location, coordinates } = req.body;
    const images = req.files ? req.files.map(file => file.path) : []; 

    if (!title || !price || !type || !category || !location || !coordinates) {
      return res.status(400).json({ message: 'Title, price, type, category, location, and coordinates are required' });
    }

    let parsedCoordinates;
    try {
      parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
      if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
        return res.status(400).json({ message: 'Coordinates must include lat and lng' });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }

    const property = await Property.create({
      title,
      description,
      price,
      type,
      category,
      location,
      coordinates: parsedCoordinates,
      images,
      listedBy: req.user._id,
      isActive: true,
      views: 0,
    });

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can view their properties' });
    }

    const properties = await Property.find({ listedBy: req.user._id });
    await Promise.all(
      properties.map(property =>
        Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } }, { new: true })
      )
    );

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const editProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    const { title, description, price, type, category, location, coordinates, isActive } = req.body;
    const images = req.files && req.files.length > 0 ? req.files.map(file => file.path) : property.images;

    let parsedCoordinates = property.coordinates;
    if (coordinates) {
      try {
        parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
        if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
          return res.status(400).json({ message: 'Coordinates must include lat and lng' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid coordinates format' });
      }
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.type = type || property.type;
    property.category = category || property.category;
    property.location = location || property.location;
    property.coordinates = parsedCoordinates;
    property.images = images;
    property.isActive = isActive !== undefined ? isActive : property.isActive;

    const updatedProperty = await property.save();
    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        const publicId = image.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(`eestate/${publicId}`);
      }
    }

    await property.deleteOne();
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};