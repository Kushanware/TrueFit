import userModel from "../models/userModel.js";

const getCartData = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "You must be logged in." });
    }

    const cartData = user.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Error while getting cart data");
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const toggleProductInCart = async (req, res) => {
  const { itemId, userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "You must be logged in." });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    if (user.cartData[itemId]) {
      delete user.cartData[itemId];
    } else {
      user.cartData[itemId] = 1;
    }

    user.markModified("cartData");

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.log("Error while toggeling product cart data");
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const emptyCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "You must be logged in." });
    }

    user.cartData = {};

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.log("Could not empty users cart");
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong while making the users empty.",
    });
  }
};

export { getCartData, toggleProductInCart, emptyCart };
