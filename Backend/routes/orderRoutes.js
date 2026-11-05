import authenticateToken from "../middlewares/authentication.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  placeOrderByCOD,
  listAllOrders,
  getOrdersCount,
  listUserOrders,
  placeOrder,
  updateOrderStatue,
  verifyPayment,
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post(
  "/orderByCOD",
  wrapAsync(authenticateToken),
  wrapAsync(placeOrderByCOD)
);
orderRouter.post("/place", wrapAsync(authenticateToken), wrapAsync(placeOrder));
orderRouter.post(
  "/verify",
  wrapAsync(authenticateToken),
  wrapAsync(verifyPayment)
);
orderRouter.get("/list", wrapAsync(authorizeAdmin), wrapAsync(listAllOrders)); // Needs to be admin
orderRouter.get(
  "/user",
  wrapAsync(authenticateToken),
  wrapAsync(listUserOrders)
);
orderRouter.post(
  "/update",
  wrapAsync(authorizeAdmin),
  wrapAsync(updateOrderStatue)
); // Needs to be admin
orderRouter.get("/count", wrapAsync(authorizeAdmin), wrapAsync(getOrdersCount)); // Needs to be admin

export default orderRouter;
