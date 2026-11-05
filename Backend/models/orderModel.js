import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Placed",
  },
  statusProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 10,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  shippingMethod: {
    type: String,
    enum: ["Standard", "Express"],
    required: true,
  },
  payment: {
    type: String,
    enum: ["Paid", "Pending", "Refunded"],
    default: "Paid",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  trackingId: {
    type: String,
    required: true,
  },
  customer: {
    type: {
      name: String,
      email: String,
      phone: String,
    },
    required: true,
  },
  items: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        discount: Number,
        color: String,
        size: String,
        quantity: String,
        reviewed: { type: Boolean, default: false },
      },
    ],
    required: true,
  },
});

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
