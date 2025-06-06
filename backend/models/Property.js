
// import mongoose from 'mongoose';

// const propertySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [0, 'Price cannot be negative'],
//   },
//   type: {
//     type: String,
//     enum: ['rent', 'sale'],
//     required: [true, 'Property type is required'],
//   },
//   category: {
//     type: String,
//     enum: ['apartment', 'house', 'commercial','residential',"industrial","retail_shop"],
//     required: [true, 'Property category is required'],
//   },
//   location: {
//     type: String,
//     // required: [true, 'Location is required'],
//     trim: true,
//   },
//   coordinates: {
//     lat: {
//       type: Number,
//       // required: [true, 'Latitude is required'],
//     },
//     lng: {
//       type: Number,
//       // required: [true, 'Longitude is required'],
//     },
//   },
//   images: [{
//     type: String,
//     trim: true,
//   }],
//   listedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Agent is required'],
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   views: {
//     type: Number,
//     default: 0,
//     min: [0, 'Views cannot be negative'],
//   },
// }, { timestamps: true });

// export default mongoose.model('Property', propertySchema)

// // import mongoose from 'mongoose';

// // const propertySchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: [true, 'Title is required'],
// //     trim: true,
// //   },
// //   description: {
// //     type: String,
// //     trim: true,
// //   },
// //   listingType: {
// //     type: String,
// //     enum: ['rent', 'sale'],
// //     required: [true, 'Listing type (rent/sale) is required'],
// //   },
// //   category: {
// //     type: String,
// //     enum: [
// //       'apartment',
// //       'independent_house',
// //       'villa',
// //       'studio_apartment',
// //       'penthouse',
// //       'duplex',
// //       'bungalow',
// //       'office_space',
// //       'retail_shop',
// //       'co_working_space',
// //       'godown_warehouse',
// //       'commercial_building',
// //       'residential_plot',
// //       'commercial_plot',
// //       'agricultural_land',
// //       'factory',
// //       'industrial_shed'
// //     ],
// //     required: [true, 'Property category is required'],
// //   },
// //   price: {
// //     type: Number,
// //     required: [true, 'Price is required'],
// //     min: [0, 'Price cannot be negative'],
// //   },
// //   area: {
// //     type: Number, // in sq.ft or sq.m based on frontend
// //     required: [true, 'Area is required'],
// //   },
// //   furnishing: {
// //     type: String,
// //     enum: ['furnished', 'semi-furnished', 'unfurnished'],
// //     default: 'unfurnished',
// //   },
// //   bedrooms: {
// //     type: Number,
// //     min: 0,
// //   },
// //   bathrooms: {
// //     type: Number,
// //     min: 0,
// //   },
// //   amenities: [{
// //     type: String,
// //     trim: true,
// //   }],
// //   floor: {
// //     type: Number,
// //     min: 0,
// //   },
// //   totalFloors: {
// //     type: Number,
// //     min: 0,
// //   },
// //   yearBuilt: {
// //     type: Number,
// //   },
// //   possessionDate: {
// //     type: Date,
// //   },
// //   availability: {
// //     type: String,
// //     enum: ['immediate', 'within_15_days', 'within_1_month', 'after_1_month'],
// //     default: 'immediate',
// //   },
// //   location: {
// //     type: String,
// //     required: [true, 'Location is required'],
// //     trim: true,
// //   },
// //   coordinates: {
// //     lat: {
// //       type: Number,
// //       required: [true, 'Latitude is required'],
// //     },
// //     lng: {
// //       type: Number,
// //       required: [true, 'Longitude is required'],
// //     },
// //   },
// //   images: [{
// //     type: String,
// //     trim: true,
// //   }],
// //   listedBy: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: [true, 'Agent is required'],
// //   },
// //   isActive: {
// //     type: Boolean,
// //     default: true,
// //   },
// //   views: {
// //     type: Number,
// //     default: 0,
// //     min: 0,
// //   }
// // }, {
// //   timestamps: true,
// // });

// // export default mongoose.model('Property', propertySchema);


import mongoose from "mongoose";


const options = { discriminatorKey: "propertyType", timestamps: true, autoIndex: true };

const basePropertySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ["rent", "sale"], required: true },
  address: { type: String, required: true, trim: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    state: { type: String, trim: true },
    state_district: { type: String, trim: true },
    village: { type: String, trim: true },
    county: { type: String, trim: true },
    fullAddress: { type: String, trim: true },
    placeName: { type: String, required: true, trim: true, default: 'Unknown location' }
  },

  features: [{ type: String }],
  status: { type: String, enum: ["available", "sold"], default: "available" },
  sqft: { type: Number, required: true },
  images: [{ type: String, trim: true }],
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0, min: 0 }
}, options);

basePropertySchema.index({ 'location.coordinates': '2dsphere' });
basePropertySchema.index({ 
  price: 1,
  isActive: 1 
}); // For sorting/filtering listings

basePropertySchema.index({ 
  'location.coordinates': '2dsphere' 
}); // For geospatial queries

basePropertySchema.index({ 
  listedBy: 1, 
  createdAt: -1 
}); // For agent dashboard queries

basePropertySchema.index({
  type: 1, // rent/sale
  propertyType: 1, // apartment/villa/etc
  status: 1 // available/sold
}); // Compound index for marketplace filters

// Text index for search functionality
basePropertySchema.index({
  name: "text",
  description: "text",
  "location.placeName": "text",
  "location.fullAddress": "text"
}, {
  weights: {
    name: 10,
    "location.placeName": 5,
    description: 1
  },
  name: "property_search_index"
});

// ======================
// INDEX OPTIMIZATION MIDDLEWARE
// ======================
// Ensure indexes are created when application starts
basePropertySchema.statics.initializeIndexes = async function() {
  try {
    await this.ensureIndexes();
    console.log('Property indexes verified');
  } catch (err) {
    console.error('Index creation failed:', err);
  }
};


// Base model
const Property = mongoose.model("Property", basePropertySchema);

// Apartment schema
const Apartment = Property.discriminator("apartment", new mongoose.Schema({
  floorNumber: Number,
  totalFloors: Number,
  bedrooms: Number,
  bathrooms: Number,
  balcony: Boolean,
}));

// Villa schema
const Villa = Property.discriminator("villa", new mongoose.Schema({
  plotArea: Number,
  garden: Boolean,
  swimmingPool: Boolean,
  garage: Boolean,
  bedrooms: Number,
  bathrooms: Number,
}));

// Plot schema
const Plot = Property.discriminator("plot", new mongoose.Schema({
  plotType: { type: String, enum: ["residential", "commercial"] },
  boundaryWall: Boolean,
}));

// Hostel schema
const Hostel = Property.discriminator("hostel", new mongoose.Schema({
  totalRooms: Number,
  sharedRooms: Boolean,
  foodIncluded: Boolean,
}));

export { Property, Apartment, Villa, Plot, Hostel };