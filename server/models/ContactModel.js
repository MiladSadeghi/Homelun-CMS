import { model, Schema } from "mongoose";

const ContactModel = Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("contact", ContactModel);
