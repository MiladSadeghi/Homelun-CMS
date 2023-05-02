import express from "express";
import {
  updatePropertyPublishStatus,
  createProperty,
  getProperties,
  updateProperty,
} from "../controller/propertyController.js";
import { isLoggedIn } from "../middleware/user.js";

const propertyRoutes = express.Router();

propertyRoutes.post("/", isLoggedIn, createProperty);
propertyRoutes.get("/", getProperties);
propertyRoutes.post("/publish", updatePropertyPublishStatus);
propertyRoutes.put("/", updateProperty);

export default propertyRoutes;
