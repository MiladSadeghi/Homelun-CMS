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
propertyRoutes.get("/", isLoggedIn, getProperties);
propertyRoutes.post("/publish", isLoggedIn, updatePropertyPublishStatus);
propertyRoutes.put("/", isLoggedIn, updateProperty);

export default propertyRoutes;
