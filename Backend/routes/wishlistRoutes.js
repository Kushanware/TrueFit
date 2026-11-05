import authenticateToken from "../middlewares/authentication.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  getWishlistData,
  toggleProductInWishlist,
} from "../controllers/wishlistControllers.js";

const wishlistRouter = express.Router();

wishlistRouter.get(
  "/get",
  wrapAsync(authenticateToken),
  wrapAsync(getWishlistData)
);
wishlistRouter.post(
  "/toggle",
  wrapAsync(authenticateToken),
  wrapAsync(toggleProductInWishlist)
);

export default wishlistRouter;
