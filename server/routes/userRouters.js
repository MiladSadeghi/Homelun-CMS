import { Router } from "express";
import { isAdmin, isLoggedIn, isSuperAdmin } from "../middleware/user.js";
import {
  createNewUser,
  disableUser,
  getUsers,
  userLogout,
} from "../controller/userController.js";

const userRouter = Router();

userRouter.post("/", isSuperAdmin, createNewUser);
userRouter.get("/", isSuperAdmin, getUsers);
userRouter.put("/disable", isSuperAdmin, disableUser);

userRouter.delete("/logout", isLoggedIn, userLogout);

export default userRouter;
