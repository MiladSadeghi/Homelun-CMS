import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
      maxLength: [30, "Your name is up to 20 chars long."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add your email or phone"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    role: {
      type: String,
      enum: ["admin", "super_admin", "agent"],
      default: "admin",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    publish: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", UserSchema);
