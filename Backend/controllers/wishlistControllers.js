import userModel from "../models/userModel.js";

const getWishlistData = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "You must be logged in." });
    }

    const wishlistData = user.wishlistData;

    res.json({ success: true, wishlistData });
  } catch (error) {
    console.log("Error while getting wishlist data");
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const toggleProductInWishlist = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "You must be logged in." });
    }

    if (!user.wishlistData) {
      user.wishlistData = {};
    }

    if (user.wishlistData[itemId]) {
      delete user.wishlistData[itemId];
    } else {
      user.wishlistData[itemId] = true;
    }

    user.markModified("wishlistData");

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.log("Error while toggeling product wishlist data");
    console.log(error);
    res.json({ success: false, message: "Somehthing went wrong" });
  }
};

export { getWishlistData, toggleProductInWishlist };
