import express from "express";
import wrapAsync from "../middlewares/wrapAsync.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import {
  addNewCoupon,
  editCoupon,
  deleteCoupon,
  verifyCoupon,
  getAllCoupons,
  getAvailableCoupons,
} from "../controllers/couponControllers.js";

const couponRouter = express.Router();

couponRouter.post("/add", wrapAsync(authorizeAdmin), wrapAsync(addNewCoupon)); // Needs to be Admin
couponRouter.put("/edit", wrapAsync(authorizeAdmin), wrapAsync(editCoupon)); // Needs to be Admin
couponRouter.get("/list", wrapAsync(authorizeAdmin), wrapAsync(getAllCoupons)); // Needs to be Admin
couponRouter.get("/available", wrapAsync(getAvailableCoupons)); // Public: coupons available to customers
couponRouter.post("/verify", wrapAsync(verifyCoupon));
couponRouter.post(
  "/delete",
  wrapAsync(authorizeAdmin),
  wrapAsync(deleteCoupon)
); // Needs to be Admin

export default couponRouter;
