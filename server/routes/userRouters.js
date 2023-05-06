import { Router } from "express";
import { isAdmin, isLoggedIn, isSuperAdmin } from "../middleware/user.js";
import {
  createNewUser,
  disableUser,
  getUserWithId,
  getUsers,
  updateUserWithId,
  userLogout,
} from "../controller/userController.js";

const userRouter = Router();

userRouter.post("/", isSuperAdmin, createNewUser);
userRouter.get("/", isSuperAdmin, getUsers);
userRouter.put("/disable", isSuperAdmin, disableUser);
userRouter.get("/:userId", isSuperAdmin, getUserWithId);
userRouter.post("/:userId", isSuperAdmin, updateUserWithId);

userRouter.delete("/logout", isLoggedIn, userLogout);

export default userRouter;
