import { Schema, model } from "mongoose";

const PropertyViewSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "agent",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const PropertyViewModel = model("property-insight", PropertyViewSchema);
