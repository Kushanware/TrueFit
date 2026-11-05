import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import express from "express";
import {
  addNewHeroBanner,
  deleteHeroBanner,
  editHeroBanner,
  listAllHeroBanners,
  getTags,
  swapHeroBanners,
} from "../controllers/heroControllers.js";

const heroRouter = express.Router();

// Upload image to cloud
import multer from "multer";
import { storage } from "../configs/cloud.js";
const upload = multer({ storage });

heroRouter.get("/listBanners", wrapAsync(listAllHeroBanners));
heroRouter.post(
  "/addNewBanner",
  wrapAsync(authorizeAdmin),
  upload.single("image"),
  wrapAsync(addNewHeroBanner)
); // Needs to be Admin
heroRouter.put(
  "/editBanner",
  wrapAsync(authorizeAdmin),
  wrapAsync(editHeroBanner)
); // Needs to be Admin
heroRouter.post(
  "/deleteBanner",
  wrapAsync(authorizeAdmin),
  wrapAsync(deleteHeroBanner)
); // Needs to be Admin
heroRouter.post("/swap", wrapAsync(authorizeAdmin), wrapAsync(swapHeroBanners)); // Needs to be Admin
heroRouter.get("/tags", wrapAsync(getTags));

export default heroRouter;
