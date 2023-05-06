import { mongoose } from "mongoose";
const PropertySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "check your address"],
    },
    furnished: {
      type: Boolean,
      required: [true, "furnished situation is undefine"],
    },
    exclusivity: {
      type: [String],
      required: [true, "exclusivity is empty"],
    },
    price: {
      type: String,
      required: [true, "the price is required"],
    },
    offPercent: {
      type: Number,
      min: 0,
      max: 100,
      required: false,
    },
    about: {
      type: String,
      required: [true, "check you overview"],
    },
    amenities: [
      {
        type: {
          _id: { type: mongoose.Types.ObjectId, auto: true },
          amenityTitle: String,
          amenity: [String],
        },
        required: [true, "check amenities"],
      },
    ],
    gallery: [
      {
        type: {
          _id: { type: mongoose.Types.ObjectId, auto: true },
          url: String,
        },
        required: [true, "check gallery"],
      },
    ],
    location: {
      type: {
        long: String,
        lat: String,
      },
      required: [true, "check location"],
      _id: false,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
    },
    publish: {
      type: Boolean,
      required: true,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "check slug"],
    },
    status: {
      type: String,
      enum: ["rent", "buy"],
      default: "rent",
    },
    area: {
      type: Number,
      required: [true, "check area"],
    },
    bedrooms: {
      type: Number,
      required: [true, "check bedroom count"],
    },
    bathrooms: {
      type: Number,
      required: [true, "check bathroom count"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("property", PropertySchema);
