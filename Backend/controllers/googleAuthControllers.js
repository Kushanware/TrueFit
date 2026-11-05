import oauth2client from "../configs/googleAuth.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const googleLogin = async (req, res) => {
  const { code } = req.query;

  try {
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { name, email, picture } = userRes.data;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        name,
        email,
        profileImage: { url: picture, filename: "" },
        role: "User",
      });

      await user.save();

      // Notifying on telegram
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      const sendTelegramNotification = async () => {
        const message = `! New user signed up !
        Using :- Google,
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
    }

    const id = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET);

    res.json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error!" });
  }
};

export { googleLogin };
