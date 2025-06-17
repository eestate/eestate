import mongoose from "mongoose";

const options = {
  discriminatorKey: "propertyType",
  timestamps: true,
  autoIndex: true,
};

const basePropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["rent", "sale"], required: true },
    address: { type: String, required: true, trim: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
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
      placeName: {
        type: String,
        required: true,
        trim: true,
        default: "Unknown location",
      },
    },

    features: [{ type: String }],
    status: { type: String, enum: ["available", "sold"], default: "available" },
    sqft: { type: Number, required: true },
    images: [{ type: String, trim: true }],
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0, min: 0 },
  },
  options
);

basePropertySchema.index({ "location.coordinates": "2dsphere" });
basePropertySchema.index({
  price: 1,
  isActive: 1,
}); // For sorting/filtering listings

basePropertySchema.index({
  "location.coordinates": "2dsphere",
}); // For geospatial queries

basePropertySchema.index({
  agentId: 1,
  createdAt: -1,
}); // For agent dashboard queries

basePropertySchema.index({
  type: 1, // rent/sale
  propertyType: 1, // apartment/villa/etc
  status: 1, // available/sold
}); // Compound index for marketplace filters

// Text index for search functionality
basePropertySchema.index(
  {
    name: "text",
    description: "text",
    "location.placeName": "text",
    "location.fullAddress": "text",
  },
  {
    weights: {
      name: 10,
      "location.placeName": 5,
      description: 1,
    },
    name: "property_search_index",
  }
);

// ======================
// INDEX OPTIMIZATION MIDDLEWARE
// ======================
// Ensure indexes are created when application starts
basePropertySchema.statics.initializeIndexes = async function () {
  try {
    await this.ensureIndexes();
    console.log("Property indexes verified");
  } catch (err) {
    console.error("Index creation failed:", err);
  }
};

// Base model
const Property = mongoose.model("Property", basePropertySchema);

const Apartment = Property.discriminator(
  "apartment",
  new mongoose.Schema({
    floorNumber: Number,
    totalFloors: Number,
    bedrooms: Number,
    bathrooms: Number,
    balcony: Boolean,
  })
);

const Villa = Property.discriminator(
  "villa",
  new mongoose.Schema({
    plotArea: Number,
    garden: Boolean,
    swimmingPool: Boolean,
    garage: Boolean,
    bedrooms: Number,
    bathrooms: Number,
  })
);

const Plot = Property.discriminator(
  "plot",
  new mongoose.Schema({
    plotType: { type: String, enum: ["residential", "commercial"] },
    boundaryWall: Boolean,
  })
);

const Hostel = Property.discriminator(
  "hostel",
  new mongoose.Schema({
    totalRooms: Number,
    sharedRooms: Boolean,
    foodIncluded: Boolean,
  })
);

export { Property, Apartment, Villa, Plot, Hostel };
