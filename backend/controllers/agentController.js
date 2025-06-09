
import mongoose from "mongoose";
import { Property, Apartment, Villa, Plot, Hostel } from "../models/Property.js";
import cloudinary from "../config/cloudinary.js"; 


// Add a new property
export const createProperty = async (req, res) => {
  try {
    const { propertyType, ...propertyData } = req.body;
    const files = req.files; // Multer stores uploaded files here

    // Validate required fields
    if (!propertyType || !["apartment", "villa", "plot", "hostel"].includes(propertyType)) {
      return res.status(400).json({ error: "Invalid or missing property type" });
    }

    // Upload images to Cloudinary
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

    // Prepare property data
    const propertyPayload = {
      ...propertyData,
      images: imageUrls,
      listedBy: req.user._id, // Assuming user is authenticated and ID is available
    };

    // Create property based on type
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

    // Save property to database
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

// Edit a property
export const editProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { propertyType, ...updateData } = req.body;
    const files = req.files;

    // Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user is authorized to edit
    if (property.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this property" });
    }

    // Handle image updates
    let imageUrls = property.images;
    if (files && files.length > 0) {
      // Delete old images from Cloudinary (optional)
      if (imageUrls.length > 0) {
        const deletePromises = imageUrls.map(url => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(`properties/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      // Upload new images
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "properties",
          resource_type: "image",
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    // Update property data
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

// Delete a property
export const deleteProperty = async (req, res) => {
  const { propertyId } = req.params; // Ensure propertyId matches the route parameter

  try {
    // Correctly destructure propertyId from req.params
    console.log(`Attempting to delete property with ID: ${propertyId}`);

    // Validate ObjectId
    if (!mongoose.isValidObjectId(propertyId)) {
      console.log(`Invalid ObjectId: ${propertyId}`);
      return res.status(400).json({ error: "Invalid property ID" });
    }

    // Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log(`Property with ID ${propertyId} not found`);
      return res.status(404).json({ error: "Property not found" });
    }

    // Check authorization
    if (property.listedBy.toString() !== req.user._id.toString()) {
      console.log(`User ${req.user._id} unauthorized to delete property ${propertyId}`);
      return res.status(403).json({ error: "Unauthorized to delete this property" });
    }

    // Delete images from Cloudinary (with error handling)
    if (property.images.length > 0) {
      try {
        const deletePromises = property.images.map(url => {
          const publicId = url.split("/").pop().split(".")[0];
          console.log(`Deleting image with publicId: ${publicId}`);
          return cloudinary.uploader.destroy(`properties/${publicId}`).catch(err => {
            console.warn(`Failed to delete image ${publicId}:`, err);
            return null; // Continue even if image deletion fails
          });
        });
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn("Image deletion failed, proceeding with property deletion:", err);
      }
    }

    // Delete property
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