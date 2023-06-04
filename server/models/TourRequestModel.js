import { model, Schema } from "mongoose";

const TourModel = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
    agent: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "agent",
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },
  },
  { timestamp: true }
);

export default model("tour", TourModel);
