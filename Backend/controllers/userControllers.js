import { cloudinary } from "../configs/cloud.js";
import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpModel from "../models/otpModel.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password both are required.",
    });
  }

  try {
    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      return res.json({
        success: false,
        message: "User not found! Please Sign up.",
      });
    }

    const correctPassword = await bcrypt.compare(password, foundUser.password);

    if (!correctPassword) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const id = foundUser._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET);

    const user = {
      name: foundUser.name,
      email: foundUser.email,
      profileImage: foundUser.profileImage || { url: "", filename: "" },
      role: foundUser.role || "User",
      _id: foundUser._id,
    };

    res.json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not login!" });
  }
};

// Signup
const sendOtpForSignup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email!" });
    }

    const alreadyExists = await userModel.findOne({ email });

    if (alreadyExists) {
      return res.json({ success: false, message: "User already exists!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOtp = new otpModel({
      email,
      otp,
    });

    await newOtp.save();

    await sendOtpEmail(email, `Your OTP is ${otp}`);

    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while sending otp." });
  }
};

const verifyOtpAndSignup = async (req, res) => {
  try {
    const { userData, otp } = req.body;
    const { name, email, password } = userData;

    if (!name || !email || !password || !otp) {
      return res.json({ success: false, message: "Missing required fields." });
    }

    const existingOtp = await otpModel.findOne({ email, otp });

    if (!existingOtp) {
      return res.json({ success: false, message: "Invalid or expired otp." });
    }

    // checking if the password is strong enough
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (min 8 digits).",
      });
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      profileImage: { url: "", filename: "" },
      role: "User",
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const id = savedUser._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET);

    const user = {
      name: savedUser.name,
      email: savedUser.email,
      profileImage: savedUser.profileImage,
      role: savedUser.role,
      _id: savedUser._id,
    };

    // Notifying on telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const sendTelegramNotification = async () => {
      const message = `! New user signed up !
    Using :- Regular,
    User name :- ${user.name},
    User email :- ${user.email},
    `;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.ok) {
          // console.log("Notification sent successfully!");
        } else {
          console.error("Failed to send notification:", result);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    sendTelegramNotification();

    await otpModel.deleteMany({ email });

    res.json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while verifying otp." });
  }
};

const getUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    const userFound = await userModel.findById(userId);

    if (!userFound) {
      return res.json({ success: false, message: "You are not logged in" });
    }

    const user = {
      name: userFound.name,
      email: userFound.email,
      phone: userFound.phone || "",
      address: userFound.address || "",
      profileImage: userFound.profileImage,
      role: userFound.role || "User",
      _id: userFound._id,
    };

    res.json({ success: true, user });
  } catch (error) {
    console.log("Error while getting user data");
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const updateUserData = async (req, res) => {
  const { userId, newName, newPhone, newAddress } = req.body;

  if (!newName) {
    return res.json({ success: false, message: "Name field is required!" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (req.file) {
      if (user.profileImage.filename.length !== 0) {
        try {
          await cloudinary.uploader.destroy(user.profileImage.filename);
        } catch (error) {
          console.log(error);
          console.log("Cannot delete image from cloud.");
        }
      }
      user.profileImage = { url: req.file.path, filename: req.file.filename };
    }

    user.name = newName;
    user.phone = newPhone || "";
    user.address = newAddress || "";

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const getUserCount = async (req, res) => {
  try {
    const users = await userModel.find({});
    const userCount = users.length;
    res.json({ success: true, userCount });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not get users count!" });
  }
};

const signupAsAdmin = async (req, res) => {
  const { userId, token, secret } = req.body;
  if (!userId || !token || !secret) {
    return res.json({
      success: false,
      message: "Incomplete admin signup data.",
    });
  }

  if (
    token !== process.env.ADMIN_SIGNUP_TOKEN ||
    secret !== process.env.ADMIN_SIGNUP_SECRET
  ) {
    return res.json({ success: false, message: "Incorrect token or secret!" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (user.role === "Admin") {
      return res.json({ success: true, user });
    }

    user.role = "Admin";

    await user.save();

    // Notifying on telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const sendTelegramNotification = async () => {
      const message = `! New admin signup detected !
    User name :- ${user.name},
    User email :- ${user.email},
    `;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.ok) {
          // console.log("Notification sent successfully!");
        } else {
          console.error("Failed to send notification:", result);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    sendTelegramNotification();

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while admin signup!" });
  }
};

export {
  loginUser,
  sendOtpForSignup,
  verifyOtpAndSignup,
  getUserData,
  updateUserData,
  getUserCount,
  signupAsAdmin,
};
