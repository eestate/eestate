import mongoose from "mongoose";
import {
  Property,
  Apartment,
  Villa,
  Plot,
  Hostel,
} from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import {
  upload,
  uploadToCloudinary,
  checkCloudinaryHealth,
} from "../middleware/uploadMiddleware.js";
import Booking from "../models/Booking.js";
import { sendMail } from "../utils/sendMail.js";
import notificationModel from "../models/Notification.js";

// Helper function to get the appropriate model based on property type
const getModelByType = (propertyType) => {
  const models = {
    apartment: Apartment,
    villa: Villa,
    plot: Plot,
    hostel: Hostel,
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
    console.log(
      "Received files:",
      req.files?.map((f) => ({ filename: f.originalname, size: f.size }))
    );
    console.log("Received body:", req.body); // Log entire body for debugging

    if (!(await checkCloudinaryHealth())) {
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
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Invalid coordinates",
        details: `Received latitude: ${latitude}, longitude: ${longitude}`,
      });
    }

    if (lat < -90 || lat > 90) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Invalid latitude",
        details: "Latitude must be between -90 and 90 degrees",
      });
    }

    if (lng < -180 || lng > 180) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Invalid longitude",
        details: "Longitude must be between -180 and 180 degrees",
      });
    }

    // Validate file sizes
    if (files?.some((f) => f.size > 10 * 1024 * 1024)) {
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
          publicId: result.public_id,
        });
      } catch (error) {
        console.error(`Upload failed for ${file.originalname}:`, error);
        await Promise.all(
          uploadedImages.map((img) => cloudinary.uploader.destroy(img.publicId))
        );
        await session.abortTransaction();
        return res.status(500).json({
          error: "File upload failed",
          details: error.message,
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
      balcony: propertyData.balcony === "true" || propertyData.balcony === true,
      garden: propertyData.garden === "true" || propertyData.garden === true,
      swimmingPool:
        propertyData.swimmingPool === "true" ||
        propertyData.swimmingPool === true,
      garage: propertyData.garage === "true" || propertyData.garage === true,
      boundaryWall:
        propertyData.boundaryWall === "true" ||
        propertyData.boundaryWall === true,
      sharedRooms:
        propertyData.sharedRooms === "true" ||
        propertyData.sharedRooms === true,
      foodIncluded:
        propertyData.foodIncluded === "true" ||
        propertyData.foodIncluded === true,
      features:
        typeof propertyData.features === "string"
          ? JSON.parse(propertyData.features || "[]")
          : Array.isArray(propertyData.features)
          ? propertyData.features
          : [],
      images: uploadedImages.map((img) => img.url),
      agentId: req.user._id,
      location: {
        type: "Point",
        coordinates: [lng, lat], // [longitude, latitude]
        state: propertyData.state || "",
        state_district: propertyData.district || "",
        village: propertyData.village || "",
        county: propertyData.county || "",
        placeName: propertyData.placeName || "Unknown location",
        fullAddress: propertyData.address || "",
      },
    };

    const PropertyModel = getModelByType(propertyType);
    const newProperty = await new PropertyModel(propertyPayload).save({
      session,
    });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: newProperty,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Property creation error:", error);
    return res.status(500).json({
      error: "Server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

export const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { propertyType, latitude, longitude, existingImages, ...updateData } =
      req.body;
    const files = req.files || [];

    console.log("Edit request:", {
      id,
      isValidId: mongoose.isValidObjectId(id),
      body: req.body,
      files: files.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
      })),
    });

    // Validate property ID
    if (!id) {
      return res.status(400).json({
        error: "Missing property ID",
        details: "No id provided in request parameters",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid property ID",
        details: `Received ID: ${id}`,
      });
    }

    // Check if property exists
    const property = await Property.findById(id);
    if (!property) {
      console.log(`Property not found for ID: ${id}`);
      return res.status(404).json({ error: "Property not found" });
    }

    // Check authorization
    if (property.agentId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this property" });
    }

    // Parse existing images
    let existingImageUrls = [];
    if (typeof existingImages === "string") {
      try {
        const parsedImages = JSON.parse(existingImages);
        existingImageUrls = Array.isArray(parsedImages)
          ? parsedImages.filter(
              (url) =>
                typeof url === "string" &&
                url.startsWith("https://res.cloudinary.com")
            )
          : [];
      } catch (err) {
        console.warn("Failed to parse existingImages:", err.message);
      }
    } else if (Array.isArray(existingImages)) {
      existingImageUrls = existingImages.filter(
        (url) =>
          typeof url === "string" &&
          url.startsWith("https://res.cloudinary.com")
      );
    }
    console.log("Parsed existingImageUrls:", existingImageUrls);

    // Handle location updates (optional)
    let locationUpdate = {};
    if (latitude !== undefined && longitude !== undefined) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }
      locationUpdate = {
        location: {
          type: "Point",
          coordinates: [lng, lat],
          state: updateData.state || property.location.state,
          state_district:
            updateData.district || property.location.state_district,
          village: updateData.village || property.location.village,
          county: updateData.county || property.location.county,
          placeName: updateData.placeName || property.location.placeName,
          fullAddress: updateData.address || property.location.fullAddress,
        },
      };
    }

    // Handle image updates
    let imageUrls = [...existingImageUrls];
    if (files.length > 0) {
      if (!(await checkCloudinaryHealth())) {
        return res.status(503).json({ error: "Media service unavailable" });
      }
      const uploadPromises = files.map(async (file) => {
        if (!file.buffer) {
          console.error(`Missing file.buffer for ${file.originalname}`);
          throw new Error(`Missing file buffer for ${file.originalname}`);
        }
        console.log(`Uploading file to Cloudinary: ${file.originalname}`);
        const result = await uploadToCloudinary(file);
        console.log(`Uploaded ${file.originalname}: ${result.secure_url}`);
        return result;
      });
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = [
        ...imageUrls,
        ...uploadResults.map((result) => result.secure_url),
      ];
    }
    console.log("Final imageUrls:", imageUrls);

    // Parse other fields
    const updatedFields = {
      ...updateData,
      price: parseFloat(updateData.price) || property.price,
      sqft: parseInt(updateData.sqft) || property.sqft,
      bedrooms: parseInt(updateData.bedrooms) || property.bedrooms,
      bathrooms: parseInt(updateData.bathrooms) || property.bathrooms,
      floorNumber: parseInt(updateData.floorNumber) || property.floorNumber,
      totalFloors: parseInt(updateData.totalFloors) || property.totalFloors,
      plotArea: parseInt(updateData.plotArea) || property.plotArea,
      totalRooms: parseInt(updateData.totalRooms) || property.totalRooms,
      balcony: updateData.balcony === "true" || updateData.balcony === true,
      garden: updateData.garden === "true" || updateData.garden === true,
      swimmingPool:
        updateData.swimmingPool === "true" || updateData.swimmingPool === true,
      garage: updateData.garage === "true" || updateData.garage === true,
      boundaryWall:
        updateData.boundaryWall === "true" || updateData.boundaryWall === true,
      sharedRooms:
        updateData.sharedRooms === "true" || updateData.sharedRooms === true,
      foodIncluded:
        updateData.foodIncluded === "true" || updateData.foodIncluded === true,
      features:
        typeof updateData.features === "string"
          ? JSON.parse(updateData.features || "[]")
          : Array.isArray(updateData.features)
          ? updateData.features
          : property.features,
      images: imageUrls,
      ...locationUpdate,
    };

    // Update property
    const PropertyModel = getModelByType(propertyType || property.propertyType);
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedProperty,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Edit property error:", {
      message: error.message,
      name: error.name,
      http_code: error.http_code || 500,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    return res.status(error.http_code || 500).json({
      error: error.message || "Server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params; // Changed from propertyId to id

  try {
    console.log("Delete request:", {
      id,
      isValidId: mongoose.isValidObjectId(id),
    });

    // Validate ObjectId
    if (!id) {
      console.log("Missing property ID in request");
      return res.status(400).json({ error: "Missing property ID" });
    }

    if (!mongoose.isValidObjectId(id)) {
      console.log(`Invalid ObjectId: ${id}`);
      return res
        .status(400)
        .json({ error: "Invalid property ID", details: `Received ID: ${id}` });
    }

    // Find property
    const property = await Property.findById(id);
    if (!property) {
      console.log(`Property with ID ${id} not found`);
      return res.status(404).json({ error: "Property not found" });
    }

    // Check authorization
    if (property.agentId.toString() !== req.user._id.toString()) {
      console.log(`User ${req.user._id} unauthorized to delete property ${id}`);
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this property" });
    }

    // Delete images from Cloudinary
    if (property.images.length > 0) {
      try {
        const deletePromises = property.images.map((url) => {
          // Extract publicId from Cloudinary URL (e.g., eestate_properties/image_id)
          const publicId = url.split("/").slice(-2).join("/").split(".")[0];
          console.log(`Deleting image with publicId: ${publicId}`);
          return cloudinary.uploader.destroy(publicId).catch((err) => {
            console.warn(`Failed to delete image ${publicId}:`, err);
            return null;
          });
        });
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn(
          "Image deletion failed, proceeding with property deletion:",
          err
        );
      }
    }

    // Delete property
    await Property.findByIdAndDelete(id);
    console.log(`Property ${id} deleted successfully`);

    return res.status(200).json({
      success: true,
      data: null,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting property ${id}:`, {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    return res.status(500).json({
      error: error.message || "Server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    if (req.user.role !== "agent") {
      return res
        .status(403)
        .json({ message: "Only agents can view their properties" });
    }

    const properties = await Property.find({ agentId: req.user._id });
    await Promise.all(
      properties.map((property) =>
        Property.findByIdAndUpdate(
          property._id,
          { $inc: { views: 1 } },
          { new: true }
        )
      )
    );

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const getAgentStats = async (req, res, next) => {
  try {
    if (req.user.role !== "agent") {
      return res
        .status(403)
        .json({ message: "Only agents can view their stats" });
    }

    const properties = await Property.find({ agentId: req.user._id });
    const propertyIds = properties.map((p) => p._id);

    const totalProperties = properties.length;
    const activeProperties = properties.filter((p) => p.isActive).length;
    const soldProperties = properties.filter((p) => !p.isActive).length;
    const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
    const totalEnquiries = await Booking.countDocuments({
      propertyId: { $in: propertyIds },
    });
    const monthlyStats = [
      { month: "Jan", views: 3200, enquiries: 1800 },
      { month: "Feb", views: 3800, enquiries: 2800 },
      { month: "Mar", views: 5200, enquiries: 4800 },
      { month: "Apr", views: 4200, enquiries: 3600 },
      { month: "May", views: 5800, enquiries: 5400 },
      { month: "Jun", views: 3600, enquiries: 2200 },
    ];

    res.status(200).json({
      totalProperties,
      activeProperties,
      soldProperties,
      totalViews,
      monthlyStats,
      totalEnquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const enquiriesMail = async (req, res) => {
  const { enquiryId, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
    return res.status(400).json({ error: "Invalid enquiryId" });
  }

  const currentBooking = await Booking.findById(enquiryId).populate(
    "propertyId"
  );
  if (!currentBooking) {
    return res.status(404).json({ message: "Booking Not Found" });
  }

  // ✅ Log before update
  console.log("Before Update - Booking Status:", currentBooking.status);

  // ✅ Update status and save
  currentBooking.status = status;
  await currentBooking.save();

  // ✅ Log after update
  console.log("After Update - Booking Status:", currentBooking.status);

  const date = new Date();
  const formattedDate = `${date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  })} ${date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;

  const img = currentBooking.propertyId.images[0];
  const name = currentBooking.propertyId.name;
  const address = currentBooking.propertyId.address;
  const userEmail = currentBooking.email;

  const baseTemplate = (title, color, message) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>
      <style>
        body {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #222;
        }
        .container {
          background-color: #fff;
          max-width: 600px;
          margin: 40px auto;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .header {
          background-color: ${color};
          padding: 20px;
          text-align: center;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .info {
          margin-bottom: 16px;
          font-size: 16px;
          line-height: 1.6;
        }
        .image img {
          width: 100%;
          max-width: 500px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #aaa;
          background-color: #fafafa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${title}</div>
        <div class="content">
          <p class="info"><strong>Name:</strong> ${name}</p>
          <p class="info"><strong>Email:</strong> ${userEmail}</p>
          <p class="info"><strong>Address:</strong> ${address}</p>
          <p class="info"><strong>Status:</strong> ${status.toUpperCase()}</p>
          <p class="info"><strong>Message:</strong><br>${message}</p>
          <p class="info"><strong>Received On:</strong> ${formattedDate}</p>
          ${
            img
              ? `<div class="image"><img src="${img}" alt="Property Image" /></div>`
              : ""
          }
        </div>
        <div class="footer">
          This is an automated email from your real estate platform. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;

  let template = "";

  if (status === "confirmed") {
    template = baseTemplate(
      "✅ Enquiry Confirmed",
      "#28a745",
      "Your enquiry has been successfully confirmed. Our team will contact you soon."
    );
  }

  if (status === "cancelled") {
    template = baseTemplate(
      "❌ Enquiry Cancelled",
      "#dc3545",
      "We regret to inform you that your enquiry has been cancelled. Please feel free to contact us again if needed."
    );
  }

  if (template) {
    sendMail(userEmail, `Agent ${status} your enquiry`, template);
  }

  console.log("req.body data", enquiryId, status);

  res.status(200).json({
    message: "Booking status updated and email sent",
    data: currentBooking,
  });
};

export const getNotificationByAgentId = async (req, res) => {
  const { agentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return res.status(400).json({ error: "Invalid agentId" });
  }

  const agentNotyfs = await notificationModel
    .find({ agentId })
    .populate("userId")
    .populate("propertyId")
    .sort({ createdAt: -1 });

  res
    .status(201)
    .json({ message: "Agent All notifications done", data: agentNotyfs });
};

export const isReadByAgentId = async (req, res) => {
  const { agentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return res.status(400).json({ error: "Invalid agentId" });
  }

  const agentNotyfs = await notificationModel.find({ agentId });

  await Promise.all(
    agentNotyfs.map(async (notyf) => {
      notyf.isRead = true;
      await notyf.save();
    })
  );

  res
    .status(200)
    .json({ message: "All Notification Is Readed", data: agentNotyfs });
};
