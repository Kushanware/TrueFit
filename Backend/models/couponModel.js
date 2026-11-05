import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Percentage", "Fixed"],
    required: true,
  },
  value: {
    type: Number,
    min: 0,
    required: true,
  },
  minPurchase: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Expired"],
    required: true,
  },
  usageLimit: {
    type: Number,
    min: 0,
    required: true,
  },
  usageCount: {
    type: Number,
    min: 0,
    required: true,
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
