import mongoose from "mongoose";
import AgentModel from "../models/AgentModel.js";
import PropertyModel from "../models/PropertyModel.js";

export const createProperty = async (req, res) => {
  const { _id } = req;
  const {
    address,
    furnished,
    exclusivity,
    price,
    offPercent,
    about,
    agent,
    location,
    amenities,
    gallery,
    area,
    bedrooms,
    bathrooms,
  } = req.body;

  if (
    !address ||
    !furnished ||
    !exclusivity ||
    !price ||
    !about ||
    !location ||
    !amenities ||
    !gallery ||
    !area ||
    !bedrooms ||
    !bathrooms
  ) {
    return res.status(400).json({
      error: true,
      message: "invalid data",
    });
  }
  const data = {
    address,
    agent,
    furnished,
    exclusivity,
    price,
    offPercent,
    about,
    location,
    amenities,
    gallery,
    area,
    slug: address.toLowerCase().replace(/[,\s]+/g, "-"),
    bedrooms,
    bathrooms,
  };

  try {
    const isUser =
      agent === ""
        ? await AgentModel.findOne({ user: _id })
        : await AgentModel.findById(data.agent);
    if (!isUser) {
      return res.status(400).json({ error: true, message: "cant find agent!" });
    }
    data.agent = isUser._id;
    if (!location.lat || !location.long) {
      return res
        .status(400)
        .json({ error: true, message: "cant find lat or long" });
    }

    const createdProperty = await PropertyModel.create(data);
    return res.status(200).json({
      error: false,
      message: "Property created",
      property: createdProperty,
    });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ error: true, message: "This address is available!." });
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getProperties = async (req, res) => {
  const { propertyId, agentId } = req.query;

  try {
    const foundedProperty = propertyId
      ? await PropertyModel.findOne({
          _id: new mongoose.Types.ObjectId(propertyId),
          ...(agentId && { user: new mongoose.Types.ObjectId(agentId) }),
        }).populate({
          path: "agent",
        })
      : await PropertyModel.find({
          ...(agentId && { user: new mongoose.Types.ObjectId(agentId) }),
        }).populate({
          path: "agent",
        });
    if (!foundedProperty) {
      return res
        .status(404)
        .json({ error: true, message: "cant find the property!" });
    }
    if (foundedProperty && foundedProperty.length === 0) {
      return res.status(204).json({ error: false, properties: [] });
    }
    return res.status(200).json({ error: false, properties: foundedProperty });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const updatePropertyPublishStatus = async (req, res) => {
  const { propertyId, status } = req.body;
  if (!propertyId || typeof status !== "boolean")
    return res
      .status(400)
      .json({ error: true, message: "please select a property" });

  try {
    await PropertyModel.findByIdAndUpdate(
      { _id: propertyId },
      { publish: status }
    );
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  const { _id } = req;
  const {
    address,
    furnished,
    exclusivity,
    price,
    offPercent,
    about,
    agent,
    location,
    amenities,
    gallery,
    propertyId,
    bedrooms,
    bathrooms,
  } = req.body;

  if (
    !address ||
    typeof furnished !== "boolean" ||
    !exclusivity ||
    !price ||
    !about ||
    !location ||
    !amenities ||
    !gallery ||
    !propertyId ||
    !bedrooms ||
    !bathrooms
  ) {
    return res.status(400).json({
      error: true,
      message: "invalid data",
    });
  }
  const data = {
    propertyId,
    address,
    agent,
    furnished,
    exclusivity,
    price,
    offPercent,
    about,
    location,
    amenities,
    gallery,
    slug: address.toLowerCase().replace(/[,\s]+/g, "-"),
    bedrooms,
    bathrooms,
  };

  try {
    const isUser =
      agent === ""
        ? await AgentModel.findOne({ user: _id })
        : await AgentModel.findById(data.agent);
    if (!isUser) {
      return res.status(400).json({ error: true, message: "cant find agent!" });
    }
    data.agent = isUser._id;
    if (!location.lat || !location.long) {
      return res
        .status(400)
        .json({ error: true, message: "cant find lat or long" });
    }

    const createdProperty = await PropertyModel.findByIdAndUpdate(
      propertyId,
      data
    );
    return res.status(200).json({
      error: false,
      message: "Property updated",
      property: createdProperty,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
