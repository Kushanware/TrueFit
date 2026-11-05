import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  profileImage: {
    url: { type: String },
    filename: { type: String },
  },
  cartData: {
    type: Object,
    default: {},
  },
  wishlistData: {
    type: Object,
    default: {},
  },
  role: {
    type: String,
    default: "User",
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
