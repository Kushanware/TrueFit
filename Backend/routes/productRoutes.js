import authenticateToken from "../middlewares/authentication.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  addProduct,
  updateProduct,
  removeProduct,
  listAllProducts,
  getProductsCount,
  getRevenue,
  addProductReview,
  deleteProductReview,
} from "../controllers/productControllers.js";

const productRouter = express.Router();

// upload image to cloud
import multer from "multer";
import { storage } from "../configs/cloud.js";
const upload = multer({ storage });

productRouter.post(
  "/add",
  wrapAsync(authorizeAdmin),
  upload.array("images", 5),
  wrapAsync(addProduct)
); // Needs to be Admin
productRouter.put(
  "/edit",
  wrapAsync(authorizeAdmin),
  upload.array("newImages", 5),
  wrapAsync(updateProduct)
); // Needs to be Admin
productRouter.post(
  "/remove",
  wrapAsync(authorizeAdmin),
  wrapAsync(removeProduct)
); // Needs to be Admin
productRouter.get("/list", wrapAsync(listAllProducts));
productRouter.get("/count", wrapAsync(getProductsCount));
productRouter.get("/revenue", wrapAsync(authorizeAdmin), wrapAsync(getRevenue)); // Needs to be admin
productRouter.post(
  "/review",
  wrapAsync(authenticateToken),
  wrapAsync(addProductReview)
);
productRouter.post(
  "/delete-review",
  wrapAsync(authorizeAdmin),
  wrapAsync(deleteProductReview)
);

export default productRouter;
