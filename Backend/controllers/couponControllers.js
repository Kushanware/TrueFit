import couponModel from "../models/couponModel.js";

const addNewCoupon = async (req, res) => {
  const { couponData } = req.body;
  const { code, type, value, minPurchase, status, usageLimit, usageCount } =
    couponData;

  if (!couponData) {
    return res.json({ success: false, message: "Coupon data not found!" });
  }

  try {
    const alreadyExists = await couponModel.findOne({ code });

    if (alreadyExists) {
      return res.json({
        success: false,
        message: `Coupon with name '${code}' already exists.`,
      });
    }

    const newCoupon = new couponModel({
      code,
      type,
      value,
      minPurchase,
      status,
      usageLimit,
      usageCount,
    });

    await newCoupon.save();

    res.json({ success: true, newCoupon });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "could not add new coupon." });
  }
};

const editCoupon = async (req, res) => {
  const {
    _id,
    code,
    type,
    value,
    minPurchase,
    status,
    usageLimit,
    usageCount,
  } = req.body;

  if (!_id || !code || !type || !status) {
    return res.json({
      success: false,
      message: "Some coupon data is missing.",
    });
  }

  try {
    const coupon = await couponModel.findById(_id);

    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found!" });
    }

    coupon.code = code;
    coupon.type = type;
    coupon.value = value;
    coupon.minPurchase = minPurchase;
    coupon.status = status;
    coupon.usageLimit = usageLimit;
    coupon.usageCount = usageCount;

    await coupon.save();
    res.json({ success: true });
  } catch (error) {
    console.log("Error while editing coupon");
    console.log(error);
    res.json({ success: false, message: "Could not edit coupon" });
  }
};

const getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({ status: "Active" });

    res.json({ success: true, coupons });
  } catch (error) {
    console.log("Error while getting available coupons");
    console.log(error);
    res.json({ success: false, message: "Error while getting coupons" });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({});

    res.json({ success: true, coupons });
  } catch (error) {
    console.log("Error while getting coupons");
    console.log(error);
    res.json({ success: false, message: "Error while getting coupons" });
  }
};

const verifyCoupon = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({ success: false, message: "Coupon code not found!" });
  }

  try {
    const coupon = await couponModel.findOne({ code });

    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found!" });
    } else if (coupon.status === "Expired") {
      return res.json({ success: false, message: "Coupon expired!" });
    }

    res.json({ success: true, coupon });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while verifying coupon code." });
  }
};

const deleteCoupon = async (req, res) => {
  const { couponId } = req.body.data;

  if (!couponId) {
    return res.json({ success: false, message: "Coupon id not found!" });
  }

  try {
    await couponModel.findByIdAndDelete(couponId);
    res.json({ success: true });
  } catch (error) {
    console.log("Error while deleting the coupon");
    console.log(error);
    res.json({ success: false, message: "Error while deleting the coupon" });
  }
};

export { addNewCoupon, getAllCoupons, getAvailableCoupons, deleteCoupon, verifyCoupon, editCoupon };
