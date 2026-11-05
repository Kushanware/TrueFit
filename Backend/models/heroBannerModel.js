import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema({
  tag: {
    type: String,
    maxLength: 20,
    required: true,
  },
  title: {
    type: String,
    maxLength: 25,
    required: true,
  },
  discount: {
    type: String,
    maxLength: 25,
    required: true,
  },
  description: {
    type: String,
    maxLength: 100,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
});

const heroBannerModel = mongoose.model("HeroBanner", heroBannerSchema);

export default heroBannerModel;
