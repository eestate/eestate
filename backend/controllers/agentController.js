

import { Property, Apartment, Villa, Plot, Hostel } from "../models/Property.js";
import cloudinary from "../config/cloudinary.js"; 

export const createProperty = async (req, res) => {
  try {
    const { propertyType, ...propertyData } = req.body;
    const files = req.files; 

    if (!propertyType || !["apartment", "villa", "plot", "hostel"].includes(propertyType)) {
      return res.status(400).json({ error: "Invalid or missing property type" });
    }

    let imageUrls = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "properties",
          resource_type: "image",
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    const propertyPayload = {
      ...propertyData,
      images: imageUrls,
      listedBy: req.user._id, 
    };

    let newProperty;
    switch (propertyType) {
      case "apartment":
        newProperty = new Apartment(propertyPayload);
        break;
      case "villa":
        newProperty = new Villa(propertyPayload);
        break;
      case "plot":
        newProperty = new Plot(propertyPayload);
        break;
      case "hostel":
        newProperty = new Hostel(propertyPayload);
        break;
      default:
        return res.status(400).json({ error: "Invalid property type" });
    }

    await newProperty.save();

    return res.status(201).json({
      success: true,
      data: newProperty,
      message: "Property added successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const editProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { propertyType, ...updateData } = req.body;
    const files = req.files;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this property" });
    }

    let imageUrls = property.images;
    if (files && files.length > 0) {
      if (imageUrls.length > 0) {
        const deletePromises = imageUrls.map(url => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(`properties/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "properties",
          resource_type: "image",
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { ...updateData, images: imageUrls },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedProperty,
      message: "Property updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log(`Attempting to delete property with ID: ${propertyId}`);

    // Validate ObjectId
    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      console.log(`Property with ID ${propertyId} not found`);
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.listedBy.toString() !== req.user._id.toString()) {
      console.log(`User ${req.user._id} unauthorized to delete property ${propertyId}`);
      return res.status(403).json({ error: "Unauthorized to delete this property" });
    }

    if (property.images.length > 0) {
      const deletePromises = property.images.map(url => {
        const publicId = url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`properties/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    await Property.findByIdAndDelete(propertyId);
    console.log(`Property ${propertyId} deleted successfully`);

    return res.status(200).json({
      success: true,
      data: null,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting property ${propertyId}:`, error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can view their properties' });
    }

    const properties = await Property.find({ listedBy: req.user._id, isActive: true });
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



export const getAgentStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can view their stats' });
    }

    const properties = await Property.find({ listedBy: req.user._id });

    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.isActive).length;
    const soldProperties = properties.filter(p => !p.isActive).length; 
    const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
    
    const monthlyStats = [
      { month: 'Jan', views: 3200, enquiries: 1800 },
      { month: 'Feb', views: 3800, enquiries: 2800 },
      { month: 'Mar', views: 5200, enquiries: 4800 },
      { month: 'Apr', views: 4200, enquiries: 3600 },
      { month: 'May', views: 5800, enquiries: 5400 },
      { month: 'Jun', views: 3600, enquiries: 2200 },
    ];

    res.status(200).json({
      totalProperties,
      activeProperties,
      soldProperties,
      totalEnquiries: totalViews, 
      monthlyStats,
    });
  } catch (error) {
    next(error);
  }
};