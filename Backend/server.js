import wishlistRouter from "./routes/wishlistRoutes.js";
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/googleAuthRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import { connectDB } from "./configs/database.js";
import orderRouter from "./routes/orderRoutes.js";
import heroRouter from "./routes/heroRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import express from "express";
import cors from "cors";
import job from "./configs/cron.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

connectDB();

if (process.env.NODE_ENV === "production") {
  job.start();
}

// api endpoints
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", message: "server is running." });
});
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/order", orderRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/hero", heroRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
