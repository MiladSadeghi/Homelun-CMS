import { Router } from "express";
import { isAdmin, isLoggedIn, isSuperAdmin } from "../middleware/user.js";
import {
  createNewUser,
  disableUser,
  enableUser,
  getUsers,
  publishAgent,
  unPublishAgent,
  userLogout,
} from "../controller/userController.js";

const userRouter = Router();

userRouter.post("/", isSuperAdmin, createNewUser);
userRouter.get("/", isSuperAdmin, getUsers);
userRouter.put("/enable", isSuperAdmin, enableUser);
userRouter.put("/disable", isSuperAdmin, disableUser);
userRouter.put("/publish", isSuperAdmin, publishAgent);
userRouter.put("/unpublish", isSuperAdmin, unPublishAgent);

userRouter.delete("/logout", isLoggedIn, userLogout);

export default userRouter;
