import orderModel from "../models/orderModel.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789", 6); // 6-digit numeric

export const generateTrackingId = async () => {
  let trackingId;
  let exists = true;

  while (exists) {
    trackingId = `TRK-${nanoid()}`;
    exists = await orderModel.exists({ trackingId });
  }

  return trackingId;
};
