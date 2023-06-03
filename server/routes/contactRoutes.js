import { Router } from "express";
import { isAdmin } from "../middleware/user.js";
import { getContactUsList } from "../controller/contactController.js";

const contactRouter = Router();

contactRouter.get("/", isAdmin, getContactUsList);

export default contactRouter;
