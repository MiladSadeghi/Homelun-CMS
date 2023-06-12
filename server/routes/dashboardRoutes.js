import { Router } from "express";
import { isLoggedIn } from "../middleware/user.js";
import { getInitialData } from "../controller/dashboardController.js";

const dashboardRoutes = Router();

dashboardRoutes.get("/views", isLoggedIn, getInitialData);

export default dashboardRoutes;
