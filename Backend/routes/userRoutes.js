import authenticateToken from "../middlewares/authentication.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  getUserData,
  loginUser,
  updateUserData,
  getUserCount,
  signupAsAdmin,
  sendOtpForSignup,
  verifyOtpAndSignup,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

// upload image to cloud
import multer from "multer";
import { storage } from "../configs/cloud.js";
const upload = multer({ storage });

userRouter.post("/login", wrapAsync(loginUser));
userRouter.post("/get-otp", wrapAsync(sendOtpForSignup));
userRouter.post("/verify-otp-signup", wrapAsync(verifyOtpAndSignup));
userRouter.get("/get", wrapAsync(authenticateToken), wrapAsync(getUserData));
userRouter.post(
  "/update",
  wrapAsync(authenticateToken),
  upload.single("image"),
  wrapAsync(authenticateToken),
  wrapAsync(updateUserData)
);
userRouter.get("/count", wrapAsync(authorizeAdmin), wrapAsync(getUserCount)); // Needs to be admin
userRouter.post(
  "/adminSignup",
  wrapAsync(authenticateToken),
  wrapAsync(signupAsAdmin)
);

export default userRouter;
