import nodemailer from "nodemailer";

const sendOtpEmail = async (to, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Use App Password here
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "OTP for Signing up to TrueFit.",
      text,
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendOtpEmail;
