// // // import Property from '../models/Property.js';
// // // import cloudinary from '../config/cloudinary.js';

// // // export const createProperty = async (req, res, next) => {
// // //   try {
// // //     if (req.user.role !== 'agent') {
// // //       return res.status(403).json({ message: 'Only agents can create properties' });
// // //     }

// // //     const existingProperties = await Property.countDocuments({ listedBy: req.user._id });
// // //     if (existingProperties > 0 && !req.user.isSubscribed) {
// // //       return res.status(403).json({ message: 'Free property limit reached. Subscribe to add more.' });
// // //     }

// // //     const { title, description, price, type, category, location, coordinates } = req.body;
// // //     const images = req.files ? req.files.map(file => file.path) : []; 

// // //     if (!title || !price || !type || !category || !location || !coordinates) {
// // //       return res.status(400).json({ message: 'Title, price, type, category, location, and coordinates are required' });
// // //     }

// // //     let parsedCoordinates;
// // //     try {
// // //       parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
// // //       if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
// // //         return res.status(400).json({ message: 'Coordinates must include lat and lng' });
// // //       }
// // //     } catch (error) {
// // //       return res.status(400).json({ message: 'Invalid coordinates format' });
// // //     }

// // //     const property = await Property.create({
// // //       title,
// // //       description,
// // //       price,
// // //       type,
// // //       category,
// // //       location,
// // //       coordinates: parsedCoordinates,
// // //       images,
// // //       listedBy: req.user._id,
// // //       isActive: true,
// // //       views: 0,
// // //     });

// // //     res.status(201).json(property);
// // //   } catch (error) {
// // //     next(error);
// // //   }
// // // };

// // // export const getMyProperties = async (req, res, next) => {
// // //   try {
// // //     if (req.user.role !== 'agent') {
// // //       return res.status(403).json({ message: 'Only agents can view their properties' });
// // //     }

// // //     const properties = await Property.find({ listedBy: req.user._id });
// // //     await Promise.all(
// // //       properties.map(property =>
// // //         Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } }, { new: true })
// // //       )
// // //     );

// // //     res.status(200).json(properties);
// // //   } catch (error) {
// // //     next(error);
// // //   }
// // // };

// // // export const editProperty = async (req, res, next) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const property = await Property.findById(id);
// // //     if (!property) {
// // //       return res.status(404).json({ message: 'Property not found' });
// // //     }

// // //     if (property.listedBy.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ message: 'Not authorized to edit this property' });
// // //     }

// // //     const { title, description, price, type, category, location, coordinates, isActive } = req.body;
// // //     const images = req.files && req.files.length > 0 ? req.files.map(file => file.path) : property.images;

// // //     let parsedCoordinates = property.coordinates;
// // //     if (coordinates) {
// // //       try {
// // //         parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
// // //         if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
// // //           return res.status(400).json({ message: 'Coordinates must include lat and lng' });
// // //         }
// // //       } catch (error) {
// // //         return res.status(400).json({ message: 'Invalid coordinates format' });
// // //       }
// // //     }

// // //     property.title = title || property.title;
// // //     property.description = description || property.description;
// // //     property.price = price || property.price;
// // //     property.type = type || property.type;
// // //     property.category = category || property.category;
// // //     property.location = location || property.location;
// // //     property.coordinates = parsedCoordinates;
// // //     property.images = images;
// // //     property.isActive = isActive !== undefined ? isActive : property.isActive;

// // //     const updatedProperty = await property.save();
// // //     res.status(200).json(updatedProperty);
// // //   } catch (error) {
// // //     next(error);
// // //   }
// // // };

// // // export const deleteProperty = async (req, res, next) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const property = await Property.findById(id);
// // //     if (!property) {
// // //       return res.status(404).json({ message: 'Property not found' });
// // //     }

// // //     if (property.listedBy.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ message: 'Not authorized to delete this property' });
// // //     }

// // //     if (property.images && property.images.length > 0) {
// // //       for (const image of property.images) {
// // //         const publicId = image.split('/').pop().split('.')[0]; // Extract public ID
// // //         await cloudinary.uploader.destroy(`eestate/${publicId}`);
// // //       }
// // //     }

// // //     await property.deleteOne();
// // //     res.status(200).json({ message: 'Property deleted successfully' });
// // //   } catch (error) {
// // //     next(error);
// // //   }
// // // };

// // import { Property, Apartment, Villa, Plot, Hostel } from '../models/Property.js';
// // import cloudinary from '../config/cloudinary.js';
// // import mongoose from 'mongoose';
// // import fs from 'fs'
// // import { promisify } from 'util';

// // const unlink = promisify(fs.unlink)

// // export const createProperty = async (req, res, next) => {
// //   try {
// //     console.log('Request Body:', req.body); // Debug body
// //     console.log('File:', req.file); // Debug single file

// //     if (req.user.role !== 'agent') {
// //       return res.status(403).json({ message: 'Only agents can create properties' });
// //     }

// //     const existingProperties = await Property.countDocuments({ listedBy: req.user._id });
// //     if (existingProperties > 0 && !req.user.isSubscribed) {
// //       return res.status(403).json({ message: 'Free property limit reached. Subscribe to add more.' });
// //     }

// //     const {
// //       name,
// //       description,
// //       price,
// //       type,
// //       subCategory,
// //       address,
// //       coordinates,
// //       features,
// //       sqft,
// //       propertyType,
// //       floorNumber,
// //       totalFloors,
// //       bedrooms,
// //       bathrooms,
// //       balcony,
// //       plotArea,
// //       garden,
// //       swimmingPool,
// //       garage,
// //       plotType,
// //       boundaryWall,
// //       totalRooms,
// //       sharedRooms,
// //       foodIncluded,
// //     } = req.body;

// //     // Log missing fields
// //     const missingFields = [];
// //     if (!name) missingFields.push('name');
// //     if (!price) missingFields.push('price');
// //     if (!type) missingFields.push('type');
// //     if (!subCategory) missingFields.push('subCategory');
// //     if (!address) missingFields.push('address');
// //     if (!sqft) missingFields.push('sqft');
// //     if (!propertyType) missingFields.push('propertyType');
// //     if (missingFields.length > 0) {
// //       console.log('Missing Fields:', missingFields);
// //       return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
// //     }

// //     // Handle single image upload from 'fields'
// //     let images = [];
// //     if (req.file) {
// //       const result = await cloudinary.uploader.upload(req.file.path, {
// //         folder: 'eestate',
// //       });
// //       images = [result.secure_url];
// //     }

// //     // Parse coordinates if provided (optional)
// //     let parsedCoordinates = {};
// //     if (coordinates) {
// //       try {
// //         parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
// //         if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
// //           return res.status(400).json({ message: 'Coordinates must include lat and lng if provided' });
// //         }
// //       } catch (error) {
// //         return res.status(400).json({ message: 'Invalid coordinates format' });
// //       }
// //     }

// //     const baseData = {
// //       name,
// //       description,
// //       price: Number(price),
// //       type,
// //       subCategory,
// //       address,
// //       coordinates: Object.keys(parsedCoordinates).length ? parsedCoordinates : undefined,
// //       features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
// //       sqft: Number(sqft),
// //       images,
// //       listedBy: req.user._id,
// //       isActive: true,
// //       views: 0,
// //     };

// //     let property;
// //     switch (propertyType.toLowerCase()) {
// //       case 'apartment':
// //         property = await Apartment.create({
// //           ...baseData,
// //           floorNumber: Number(floorNumber) || undefined,
// //           totalFloors: Number(totalFloors) || undefined,
// //           bedrooms: Number(bedrooms) || undefined,
// //           bathrooms: Number(bathrooms) || undefined,
// //           balcony: balcony === 'true' || balcony === true,
// //         });
// //         break;
// //       case 'villa':
// //         property = await Villa.create({
// //           ...baseData,
// //           plotArea: Number(plotArea) || undefined,
// //           garden: garden === 'true' || garden === true,
// //           swimmingPool: swimmingPool === 'true' || swimmingPool === true,
// //           garage: garage === 'true' || garage === true,
// //           bedrooms: Number(bedrooms) || undefined,
// //           bathrooms: Number(bathrooms) || undefined,
// //         });
// //         break;
// //       case 'plot':
// //         property = await Plot.create({
// //           ...baseData,
// //           plotType,
// //           boundaryWall: boundaryWall === 'true' || boundaryWall === true,
// //         });
// //         break;
// //       case 'hostel':
// //         property = await Hostel.create({
// //           ...baseData,
// //           totalRooms: Number(totalRooms) || undefined,
// //           sharedRooms: sharedRooms === 'true' || sharedRooms === true,
// //           foodIncluded: foodIncluded === 'true' || foodIncluded === true,
// //         });
// //         break;
// //       default:
// //         return res.status(400).json({ message: 'Invalid propertyType' });
// //     }

// //     res.status(201).json(property);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // export const getMyProperties = async (req, res, next) => {
// //   try {
// //     if (req.user.role !== 'agent') {
// //       return res.status(403).json({ message: 'Only agents can view their properties' });
// //     }

// //     const properties = await Property.find({ listedBy: req.user._id });
// //     await Promise.all(
// //       properties.map(property =>
// //         Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } }, { new: true })
// //       )
// //     );

// //     res.status(200).json(properties);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // export const editProperty = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;

// //     const property = await Property.findById(id);
// //     if (!property) {
// //       return res.status(404).json({ message: 'Property not found' });
// //     }

// //     if (property.listedBy.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: 'Not authorized to edit this property' });
// //     }

// //     const {
// //       name,
// //       description,
// //       price,
// //       type,
// //       subCategory,
// //       address,
// //       coordinates,
// //       features,
// //       sqft,
// //       isActive,
// //       floorNumber,
// //       totalFloors,
// //       bedrooms,
// //       bathrooms,
// //       balcony,
// //       plotArea,
// //       garden,
// //       swimmingPool,
// //       garage,
// //       plotType,
// //       boundaryWall,
// //       totalRooms,
// //       sharedRooms,
// //       foodIncluded,
// //     } = req.body;

// //     // Handle single image upload from 'fields'
// //     let images = property.images;
// //     if (req.file) {
// //       const result = await cloudinary.uploader.upload(req.file.path, {
// //         folder: 'eestate',
// //       });
// //       images = [result.secure_url];
// //     }

// //     // Parse coordinates if provided
// //     let parsedCoordinates = property.coordinates || {};
// //     if (coordinates) {
// //       try {
// //         parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
// //         if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
// //           return res.status(400).json({ message: 'Coordinates must include lat and lng if provided' });
// //         }
// //       } catch (error) {
// //         return res.status(400).json({ message: 'Invalid coordinates format' });
// //       }
// //     }

// //     property.name = name || property.name;
// //     property.description = description || property.description;
// //     property.price = price ? Number(price) : property.price;
// //     property.type = type || property.type;
// //     property.subCategory = subCategory || property.subCategory;
// //     property.address = address || property.address;
// //     property.coordinates = Object.keys(parsedCoordinates).length ? parsedCoordinates : undefined;
// //     property.features = features
// //       ? Array.isArray(features)
// //         ? features
// //         : JSON.parse(features)
// //       : property.features;
// //     property.sqft = sqft ? Number(sqft) : property.sqft;
// //     property.images = images;
// //     property.isActive = isActive !== undefined ? isActive : property.isActive;

// //     // Update type-specific fields
// //     switch (property.propertyType) {
// //       case 'apartment':
// //         property.floorNumber = floorNumber ? Number(floorNumber) : property.floorNumber;
// //         property.totalFloors = totalFloors ? Number(totalFloors) : property.totalFloors;
// //         property.bedrooms = bedrooms ? Number(bedrooms) : property.bedrooms;
// //         property.bathrooms = bathrooms ? Number(bathrooms) : property.bathrooms;
// //         property.balcony = balcony !== undefined ? balcony === 'true' || balcony === true : property.balcony;
// //         break;
// //       case 'villa':
// //         property.plotArea = plotArea ? Number(plotArea) : property.plotArea;
// //         property.garden = garden !== undefined ? garden === 'true' || garden === true : property.garden;
// //         property.swimmingPool = swimmingPool !== undefined ? swimmingPool === 'true' || swimmingPool === true : property.swimmingPool;
// //         property.garage = garage !== undefined ? garage === 'true' || garage === true : property.garage;
// //         property.bedrooms = bedrooms ? Number(bedrooms) : property.bedrooms;
// //         property.bathrooms = bathrooms ? Number(bathrooms) : property.bathrooms;
// //         break;
// //       case 'plot':
// //         property.plotType = plotType || property.plotType;
// //         property.boundaryWall = boundaryWall !== undefined ? boundaryWall === 'true' || boundaryWall === true : property.balcony;
// //         break;
// //       case 'hostel':
// //         property.totalRooms = totalRooms ? Number(totalRooms) : property.totalRooms;
// //         property.sharedRooms = sharedRooms !== undefined ? sharedRooms === 'true' || sharedRooms === true : property.sharedRooms;
// //         property.foodIncluded = foodIncluded !== undefined ? foodIncluded === 'true' || foodIncluded === true : property.foodIncluded;
// //         break;
// //     }

// //     const updatedProperty = await property.save();
// //     res.status(200).json(updatedProperty);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // export const deleteProperty = async (req, res, next) => {
// //   try {
// //     console.log('Delete Request:', { id: req.params.id, user: req.user }); // Debug
// //     const { id } = req.params;

// //     if (!req.user) {
// //       return res.status(401).json({ message: 'Not authorized, user not found' });
// //     }

// //     if (!mongoose.isValidObjectId(id)) {
// //       return res.status(400).json({ message: 'Invalid property ID' });
// //     }

// //     const property = await Property.findById(id);
// //     if (!property) {
// //       return res.status(404).json({ message: 'Property not found' });
// //     }

// //     if (property.listedBy.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: 'Not authorized to delete this property' });
// //     }

// //     // Delete associated images from Cloudinary
// //     if (property.images && property.images.length > 0) {
// //       await Promise.all(
// //         property.images.map(async (image) => {
// //           const publicId = image.split('/').pop().split('.')[0];
// //           console.log('Deleting Cloudinary image:', `eestate/${publicId}`);
// //           await cloudinary.uploader.destroy(`eestate/${publicId}`);
// //         })
// //       );
// //     }

// //     // Delete property
// //     const result = await Property.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
// //     console.log('Delete Result:', result); // Debug

// //     if (result.deletedCount === 0) {
// //       return res.status(404).json({ message: 'Property not deleted, please try again' });
// //     }

// //     res.status(200).json({ message: 'Property deleted successfully' });
// //   } catch (error) {
// //     console.error('Delete Error:', error);
// //     next(error);
// //   }
// // };

// import { Property, Apartment, Villa, Plot, Hostel } from '../models/Property.js';
// import cloudinary from '../config/cloudinary.js';
// import mongoose from 'mongoose';

// export const createProperty = async (req, res, next) => {
//   try {
//     console.log('Request Body:', req.body);
//     console.log('File:', req.file);

//     if (req.user.role !== 'agent') {
//       return res.status(403).json({ message: 'Only agents can create properties' });
//     }

//     const existingProperties = await Property.countDocuments({ listedBy: req.user._id });
//     if (existingProperties > 0 && !req.user.isSubscribed) {
//       return res.status(403).json({ message: 'Free property limit reached. Subscribe to add more.' });
//     }

//     const {
//       name,
//       description,
//       price,
//       type,
//       subCategory,
//       address,
//       coordinates,
//       features,
//       sqft,
//       propertyType,
//       floorNumber,
//       totalFloors,
//       bedrooms,
//       bathrooms,
//       balcony,
//       plotArea,
//       garden,
//       swimmingPool,
//       garage,
//       plotType,
//       boundaryWall,
//       totalRooms,
//       sharedRooms,
//       foodIncluded,
//     } = req.body;

//     // Validate required fields
//     const missingFields = [];
//     if (!name) missingFields.push('name');
//     if (!price) missingFields.push('price');
//     if (!type) missingFields.push('type');
//     if (!subCategory) missingFields.push('subCategory');
//     if (!address) missingFields.push('address');
//     if (!sqft) missingFields.push('sqft');
//     if (!propertyType) missingFields.push('propertyType');
//     if (missingFields.length > 0) {
//       return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
//     }

//     // Validate enum fields
//     const validTypes = ['rent', 'sale'];
//     const normalizedType = type.toLowerCase();
//     if (!validTypes.includes(normalizedType)) {
//       return res.status(400).json({ message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
//     }

//     // Validate numeric fields
//     if (isNaN(Number(price)) || Number(price) < 0) {
//       return res.status(400).json({ message: 'Invalid price' });
//     }
//     if (isNaN(Number(sqft)) || Number(sqft) <= 0) {
//       return res.status(400).json({ message: 'Invalid sqft' });
//     }

//     // Handle image upload (using multer-storage-cloudinary)
//     let images = [];
//     if (req.file) {
//       images = [req.file.secure_url]; // multer-storage-cloudinary provides secure_url
//     } else {
//       return res.status(400).json({ message: 'Image is required' }); // Make image mandatory if desired
//     }

//     // Parse coordinates if provided
//     let parsedCoordinates = {};
//     if (coordinates) {
//       try {
//         parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
//         if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
//           return res.status(400).json({ message: 'Coordinates must include lat and lng if provided' });
//         }
//       } catch (error) {
//         return res.status(400).json({ message: 'Invalid coordinates format' });
//       }
//     }

//     const baseData = {
//       name,
//       description,
//       price: Number(price),
//       type: normalizedType,
//       subCategory,
//       address,
//       coordinates: Object.keys(parsedCoordinates).length ? parsedCoordinates : undefined,
//       features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
//       sqft: Number(sqft),
//       images,
//       listedBy: req.user._id,
//       isActive: true,
//       views: 0,
//     };

//     let property;
//     switch (propertyType.toLowerCase()) {
//       case 'apartment':
//         property = await Apartment.create({
//           ...baseData,
//           floorNumber: Number(floorNumber) || undefined,
//           totalFloors: Number(totalFloors) || undefined,
//           bedrooms: Number(bedrooms) || undefined,
//           bathrooms: Number(bathrooms) || undefined,
//           balcony: balcony === 'true' || balcony === true,
//         });
//         break;
//       case 'villa':
//         property = await Villa.create({
//           ...baseData,
//           plotArea: Number(plotArea) || undefined,
//           garden: garden === 'true' || garden === true,
//           swimmingPool: swimmingPool === 'true' || swimmingPool === true,
//           garage: garage === 'true' || garage === true,
//           bedrooms: Number(bedrooms) || undefined,
//           bathrooms: Number(bathrooms) || undefined,
//         });
//         break;
//       case 'plot':
//         property = await Plot.create({
//           ...baseData,
//           plotType,
//           boundaryWall: boundaryWall === 'true' || boundaryWall === true,
//         });
//         break;
//       case 'hostel':
//         property = await Hostel.create({
//           ...baseData,
//           totalRooms: Number(totalRooms) || undefined,
//           sharedRooms: sharedRooms === 'true' || sharedRooms === true,
//           foodIncluded: foodIncluded === 'true' || foodIncluded === true,
//         });
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid propertyType' });
//     }

//     res.status(201).json(property);
//   } catch (error) {
//     next(error);
//   }
// };

// export const editProperty = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const property = await Property.findById(id);
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     if (property.listedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to edit this property' });
//     }

//     const {
//       name,
//       description,
//       price,
//       type,
//       subCategory,
//       address,
//       coordinates,
//       features,
//       sqft,
//       isActive,
//       floorNumber,
//       totalFloors,
//       bedrooms,
//       bathrooms,
//       balcony,
//       plotArea,
//       garden,
//       swimmingPool,
//       garage,
//       plotType,
//       boundaryWall,
//       totalRooms,
//       sharedRooms,
//       foodIncluded,
//     } = req.body;

//     // Handle image upload
//     let images = property.images;
//     if (req.file) {
//       // Delete old images from Cloudinary
//       if (images.length > 0) {
//         await Promise.all(
//           images.map(async (image) => {
//             const publicId = image.split('/').pop().split('.')[0];
//             await cloudinary.uploader.destroy(`eestate/${publicId}`);
//           })
//         );
//       }
//       images = [req.file.secure_url]; // Use new image URL from multer-storage-cloudinary
//     }

//     // Parse coordinates if provided
//     let parsedCoordinates = property.coordinates || {};
//     if (coordinates) {
//       try {
//         parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
//         if (!parsedCoordinates.lat || !parsedCoordinates.lng) {
//           return res.status(400).json({ message: 'Coordinates must include lat and lng if provided' });
//         }
//       } catch (error) {
//         return res.status(400).json({ message: 'Invalid coordinates format' });
//       }
//     }

//     property.name = name || property.name;
//     property.description = description || property.description;
//     property.price = price ? Number(price) : property.price;
//     property.type = type || property.type;
//     property.subCategory = subCategory || property.subCategory;
//     property.address = address || property.address;
//     property.coordinates = Object.keys(parsedCoordinates).length ? parsedCoordinates : undefined;
//     property.features = features
//       ? Array.isArray(features)
//         ? features
//         : JSON.parse(features)
//       : property.features;
//     property.sqft = sqft ? Number(sqft) : property.sqft;
//     property.images = images;
//     property.isActive = isActive !== undefined ? isActive : property.isActive;

//     // Update type-specific fields
//     switch (property.propertyType) {
//       case 'apartment':
//         property.floorNumber = floorNumber ? Number(floorNumber) : property.floorNumber;
//         property.totalFloors = totalFloors ? Number(totalFloors) : property.totalFloors;
//         property.bedrooms = bedrooms ? Number(bedrooms) : property.bedrooms;
//         property.bathrooms = bathrooms ? Number(bathrooms) : property.bathrooms;
//         property.balcony = balcony !== undefined ? balcony === 'true' || balcony === true : property.balcony;
//         break;
//       case 'villa':
//         property.plotArea = plotArea ? Number(plotArea) : property.plotArea;
//         property.garden = garden !== undefined ? garden === 'true' || garden === true : property.garden;
//         property.swimmingPool = swimmingPool !== undefined ? swimmingPool === 'true' || swimmingPool === true : property.swimmingPool;
//         property.garage = garage !== undefined ? garage === 'true' || garage === true : property.garage;
//         property.bedrooms = bedrooms ? Number(bedrooms) : property.bedrooms;
//         property.bathrooms = bathrooms ? Number(bathrooms) : property.bathrooms;
//         break;
//       case 'plot':
//         property.plotType = plotType || property.plotType;
//         property.boundaryWall = boundaryWall !== undefined ? boundaryWall === 'true' || boundaryWall === true : property.boundaryWall; // Fixed typo
//         break;
//       case 'hostel':
//         property.totalRooms = totalRooms ? Number(totalRooms) : property.totalRooms;
//         property.sharedRooms = sharedRooms !== undefined ? sharedRooms === 'true' || sharedRooms === true : property.sharedRooms;
//         property.foodIncluded = foodIncluded !== undefined ? foodIncluded === 'true' || foodIncluded === true : property.foodIncluded;
//         break;
//     }

//     const updatedProperty = await property.save();
//     res.status(200).json(updatedProperty);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteProperty = async (req, res, next) => {
//   try {
//     console.log('Delete Request:', { id: req.params.id, user: req.user });
//     const { id } = req.params;

//     if (!req.user) {
//       return res.status(401).json({ message: 'Not authorized, user not found' });
//     }

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({ message: 'Invalid property ID' });
//     }

//     const property = await Property.findById(id);
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     if (property.listedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this property' });
//     }

//     // Delete associated images from Cloudinary
//     if (property.images && property.images.length > 0) {
//       await Promise.all(
//         property.images.map(async (image) => {
//           const publicId = image.split('/').pop().split('.')[0];
//           console.log('Deleting Cloudinary image:', `eestate/${publicId}`);
//           await cloudinary.uploader.destroy(`eestate/${publicId}`);
//         })
//       );
//     }

//     // Delete property
//     const result = await Property.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
//     console.log('Delete Result:', result);

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'Property not deleted, please try again' });
//     }

//     res.status(200).json({ message: 'Property deleted successfully' });
//   } catch (error) {
//     console.error('Delete Error:', error);
//     next(error);
//   }
// };

// export const getMyProperties = async (req, res, next) => {
//   try {
//     if (req.user.role !== 'agent') {
//       return res.status(403).json({ message: 'Only agents can view their properties' });
//     }

//     const properties = await Property.find({ listedBy: req.user._id });
//     await Promise.all(
//       properties.map(property =>
//         Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } }, { new: true })
//       )
//     );

//     res.status(200).json(properties);
//   } catch (error) {
//     next(error);
//   }
// };

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
  try {
    const { propertyId } = req.params;

    // Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user is authorized to delete
    if (property.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this property" });
    }

    // Delete images from Cloudinary
    if (property.images.length > 0) {
      const deletePromises = property.images.map(url => {
        const publicId = url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`properties/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    // Delete property
    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json({
      success: true,
      data: null,
      message: "Property deleted successfully",
    });
  } catch (error) {
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