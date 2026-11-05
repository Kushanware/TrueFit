import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authorizeAdmin = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "!Access Denied!" });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.json({ success: false, message: "!Access Denied!" });
    }

    const userId = verifiedToken.id || verifiedToken._id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "!Access Denied!" });
    }

    if (user.role === "Admin") {
      next();
    } else {
      return res.json({ success: false, message: "!Access Denied!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while admin authorization" });
  }
};

export default authorizeAdmin;
