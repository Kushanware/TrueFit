import authenticateToken from "../middlewares/authentication.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  emptyCart,
  getCartData,
  toggleProductInCart,
} from "../controllers/cartControllers.js";

const cartRouter = express.Router();

cartRouter.get("/get", wrapAsync(authenticateToken), wrapAsync(getCartData));
cartRouter.post(
  "/toggle",
  wrapAsync(authenticateToken),
  wrapAsync(toggleProductInCart)
);
cartRouter.post("/empty", wrapAsync(authenticateToken), wrapAsync(emptyCart));

export default cartRouter;
