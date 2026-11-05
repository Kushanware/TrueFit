import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Truefit_Development",
    allowedFormat: ["png", "jpg", "jpeg", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export { cloudinary, storage };
