import { googleLogin } from "../controllers/googleAuthControllers.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/google", wrapAsync(googleLogin));

export default authRouter;
