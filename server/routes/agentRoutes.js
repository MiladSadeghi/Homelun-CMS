import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/user.js";
import {
  getAgent,
  getAgentProfile,
  getAgents,
  updateAgentProfile,
  updateAgentPublishStatus,
} from "../controller/agentController.js";

const agentRoutes = Router();

agentRoutes.get("/profile", isLoggedIn, getAgentProfile);
agentRoutes.post("/profile", isLoggedIn, updateAgentProfile);

agentRoutes.get("/all", isAdmin, getAgents);
agentRoutes.post("/publish", isAdmin, updateAgentPublishStatus);
agentRoutes.get("/:id?", isAdmin, getAgent);

export default agentRoutes;
