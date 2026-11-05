import heroBannerModel from "../models/heroBannerModel.js";
import { cloudinary } from "../configs/cloud.js";

const listAllHeroBanners = async (req, res) => {
  try {
    const banners = await heroBannerModel.find({});
    res.json({ success: true, banners });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while getting hero banners." });
  }
};

const addNewHeroBanner = async (req, res) => {
  const { tag, title, discount, description } = req.body;
  const bannerImage = {
    url: req.file.path,
    filename: req.file.filename,
  };

  try {
    const alreadyExists = await heroBannerModel.findOne({ tag });

    if (alreadyExists) {
      return res.json({
        success: false,
        message: "Hero banner already exists!",
      });
    }

    const lastBanner = await heroBannerModel.findOne().sort({ order: -1 });

    const nextOrder = lastBanner ? lastBanner.order + 1 : 0;

    const newBanner = new heroBannerModel({
      tag,
      title,
      discount,
      description,
      order: nextOrder,
      image: bannerImage,
    });

    await newBanner.save();
    res.json({ success: true, newBanner });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not add new banner." });
  }
};

const editHeroBanner = async (req, res) => {
  const { _id, tag, title, discount, description } = req.body;

  try {
    const banner = await heroBannerModel.findById(_id);

    if (!banner) {
      return res.json({ success: false, message: "Banner does not exists!" });
    }

    (banner.tag = tag),
      (banner.title = title),
      (banner.discount = discount),
      (banner.description = description),
      await banner.save();

    res.json({ success: true, banner });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const deleteHeroBanner = async (req, res) => {
  const { id } = req.body;
  try {
    const banners = await heroBannerModel.find({});
    if (banners.length === 1) {
      return res.json({
        success: false,
        message: "At least one banner is required.",
      });
    }

    const banner = await heroBannerModel.findById(id);

    if (!banner) {
      return res.json({ success: false, message: "Banner not found!" });
    }

    const bannerImage = banner.image.filename;

    if (bannerImage) {
      try {
        await cloudinary.uploader.destroy(bannerImage);
      } catch (error) {
        console.log(error);
        console.log("Cannot delete image from cloud.");
      }
    }

    await heroBannerModel.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const swapHeroBanners = async (req, res) => {
  const { banners } = req.body;
  try {
    for (let banner of banners) {
      await heroBannerModel.findByIdAndUpdate(banner._id, {
        order: banner.order,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const getTags = async (req, res) => {
  try {
    const banners = await heroBannerModel.find({});

    const tags = banners.map((currBanner) => currBanner.tag);

    res.json({ success: true, tags });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
};

export {
  listAllHeroBanners,
  addNewHeroBanner,
  editHeroBanner,
  deleteHeroBanner,
  getTags,
  swapHeroBanners,
};
