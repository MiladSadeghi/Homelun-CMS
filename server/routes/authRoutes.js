import express from "express";
import { withRefreshToken } from "../middleware/user.js";
import { login, refreshToken, whoAmI } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.get("/who-am-i", withRefreshToken, whoAmI);
authRoutes.post("/login", login);
authRoutes.post("/refresh-token", refreshToken);

export default authRoutes;
