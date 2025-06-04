
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

const options = { discriminatorKey: "propertyType", timestamps: true };

const basePropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  type: {
    type: String,
    enum: ["rent", "sale"],
    required: [true, "Property type is required"],
  },
//   subCategory: {
//     type: String,
//     enum: ["apartment", "commercial", "residential", "industrial", "retail_shop"],
//     required: [true, "Sub-category is required"],
//   },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  features: [{ type: String }],
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
  sqft: {
    type: Number,
    required: [true, "Square footage is required"],
  },
  images: [{
    type: String,
    trim: true,
  }],
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Agent is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
    min: [0, "Views cannot be negative"],
  },
}, options);

const Property = mongoose.model("Property", basePropertySchema);

const Apartment = Property.discriminator("apartment", new mongoose.Schema({
  floorNumber: Number,
  totalFloors: Number,
  bedrooms: Number,
  bathrooms: Number,
  balcony: Boolean,
}));

const Villa = Property.discriminator("villa", new mongoose.Schema({
  plotArea: Number,
  garden: Boolean,
  swimmingPool: Boolean,
  garage: Boolean,
  bedrooms: Number,
  bathrooms: Number,
}));

const Plot = Property.discriminator("plot", new mongoose.Schema({
  plotType: { type: String, enum: ["residential", "commercial"] },
  boundaryWall: Boolean,
}));

const Hostel = Property.discriminator("hostel", new mongoose.Schema({
  totalRooms: Number,
  sharedRooms: Boolean,
  foodIncluded: Boolean,
}));

export { Property, Apartment, Villa, Plot, Hostel };