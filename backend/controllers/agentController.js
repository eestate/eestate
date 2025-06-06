

import { Property, Apartment, Villa, Plot, Hostel } from "../models/Property.js";
import cloudinary from "../config/cloudinary.js"; 
import mongoose from "mongoose";
import fs from 'fs'
import { upload, uploadToCloudinary, checkCloudinaryHealth } from "../middleware/uploadMiddleware.js";

// Helper function to get the appropriate model based on property type
const getModelByType = (propertyType) => {
  const models = {
    apartment: Apartment,
    villa: Villa,
    plot: Plot,
    hostel: Hostel
  };
  
  if (!models[propertyType]) {
    throw new Error(`Invalid property type: ${propertyType}`);
  }
  
  return models[propertyType];
};

export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Received files:', req.files?.map(f => ({ filename: f.originalname, size: f.size })));
    console.log('Received body:', req.body); // Log entire body for debugging

    if (!await checkCloudinaryHealth()) {
      await session.abortTransaction();
      return res.status(503).json({ error: "Media service unavailable" });
    }

    const { propertyType, latitude, longitude, ...propertyData } = req.body;
    const files = req.files;

    if (!["apartment", "villa", "plot", "hostel"].includes(propertyType)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid property type" });
    }

    // Validate coordinates
    if (latitude === undefined || longitude === undefined) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: "Invalid coordinates",
        details: `Received latitude: ${latitude}, longitude: ${longitude}`
      });
    }

    if (lat < -90 || lat > 90) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: "Invalid latitude",
        details: "Latitude must be between -90 and 90 degrees"
      });
    }

    if (lng < -180 || lng > 180) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: "Invalid longitude",
        details: "Longitude must be between -180 and 180 degrees"
      });
    }

    // Validate file sizes
    if (files?.some(f => f.size > 10 * 1024 * 1024)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "File size exceeds 10MB limit" });
    }

    const uploadedImages = [];
    for (const file of files || []) {
      console.log(`Uploading file: ${file.originalname}`);
      try {
        const result = await uploadToCloudinary(file);
        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      } catch (error) {
        console.error(`Upload failed for ${file.originalname}:`, error);
        await Promise.all(
          uploadedImages.map(img => cloudinary.uploader.destroy(img.publicId))
        );
        await session.abortTransaction();
        return res.status(500).json({ 
          error: "File upload failed",
          details: error.message
        });
      }
    }

    const propertyPayload = {
      ...propertyData,
      price: parseFloat(propertyData.price) || 0,
      sqft: parseFloat(propertyData.sqft) || 0,
      bedrooms: parseInt(propertyData.bedrooms) || undefined,
      bathrooms: parseInt(propertyData.bathrooms) || undefined,
      floorNumber: parseInt(propertyData.floorNumber) || undefined,
      totalFloors: parseInt(propertyData.totalFloors) || undefined,
      balcony: propertyData.balcony === 'true' || propertyData.balcony === true,
      garden: propertyData.garden === 'true' || propertyData.garden === true,
      swimmingPool: propertyData.swimmingPool === 'true' || propertyData.swimmingPool === true,
      garage: propertyData.garage === 'true' || propertyData.garage === true,
      boundaryWall: propertyData.boundaryWall === 'true' || propertyData.boundaryWall === true,
      sharedRooms: propertyData.sharedRooms === 'true' || propertyData.sharedRooms === true,
      foodIncluded: propertyData.foodIncluded === 'true' || propertyData.foodIncluded === true,
      features: typeof propertyData.features === 'string' 
        ? JSON.parse(propertyData.features || '[]') 
        : Array.isArray(propertyData.features) ? propertyData.features : [],
      images: uploadedImages.map(img => img.url),
      listedBy: req.user._id,
      location: {
        type: "Point",
        coordinates: [lng, lat], // [longitude, latitude]
        state: propertyData.state || '',
        state_district: propertyData.district || '',
        village: propertyData.village || '',
        county: propertyData.county || '',
        placeName: propertyData.placeName || "Unknown location",
        fullAddress: propertyData.address || ''
      }
    };

    const PropertyModel = getModelByType(propertyType);
    const newProperty = await new PropertyModel(propertyPayload).save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: newProperty
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Property creation error:", error);
    return res.status(500).json({ 
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  } finally {
    session.endSession();
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
          folder: "eestate",
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
    const { propertyId } = req.params;

  try {
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