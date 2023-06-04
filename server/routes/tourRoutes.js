import { Router } from "express";
import { isLoggedIn } from "../middleware/user.js";
import { getTourRequests } from "../controller/tourController.js";

const tourRouter = Router();

tourRouter.get("/", isLoggedIn, getTourRequests);
tourRouter.get("/:agentId", isLoggedIn, getTourRequests);

export default tourRouter;
