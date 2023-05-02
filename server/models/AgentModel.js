import mongoose, { Schema } from "mongoose";

const AgentSchema = Schema(
  {
    name: {
      type: String,
      unique: true,
      required: function () {
        return this.isNew ? false : [true, "please fill the agent name"];
      },
      setRequiredOnUpdate: true,
    },
    field: {
      type: String,
      required: function () {
        return this.isNew ? false : [true, "please fill the agent field"];
      },
      setRequiredOnUpdate: true,
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.isNew
          ? false
          : [true, "please fill the agent phone number"];
      },
      setRequiredOnUpdate: true,
    },
    social: {
      type: {
        instagram: String,
        linkedin: String,
        twitter: String,
      },
    },
    about: {
      type: String,
      required: function () {
        return this.isNew ? false : [true, "please fill the agent about field"];
      },
      setRequiredOnUpdate: true,
    },
    agentListing: [
      {
        type: Schema.Types.ObjectId,
        ref: "property",
      },
    ],
    cover: {
      type: String,
      required: function () {
        return this.isNew
          ? false
          : [true, "please add a profile photo for the agent"];
      },
      setRequiredOnUpdate: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    publish: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "check slug"],
    },
  },
  { timestamp: true }
);

export default mongoose.model("agent", AgentSchema);
