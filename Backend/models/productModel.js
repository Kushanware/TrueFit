import mongoose from "mongoose";
import reviewModel from "./reviewModel.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Jackets",
      "T-Shirts",
      "Shirts",
      "Pants",
      "Shoes",
      "Bags",
      "Watches",
      "Caps",
    ],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Men", "Women", "Unisex", "Kids"],
    default: "Unisex",
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  colors: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    enum: ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10"],
    default: ["M"],
  },
  images: {
    type: [{ url: String, filename: String }],
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  stock: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Low Stock", "Out of Stock"],
    default: "Active",
  },
  margin: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  sale: {
    type: Number,
    min: 0,
    default: 0,
  },
  profit: {
    type: Number,
    min: 0,
    default: 0,
  },
});

productSchema.post("findOneAndDelete", async (product) => {
  if (product) {
    await reviewModel.deleteMany({ _id: { $in: product.reviews } });
  }
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
