import express from "express";
import {
  editProfile,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.js";
import protect from "../middlewares/auth.js";
import upload from "../utills/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logout);
userRouter.get("/profile", protect, getUserProfile);
userRouter.put(
  "/profile/update",
  protect,
  upload.single("profilePhoto"),
  editProfile,
);

export default userRouter;
