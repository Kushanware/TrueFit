import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  await mongoose
    .connect(`${process.env.ATLAS_DB_URL}`)
    .then(() => console.log("DB Connected"));
};
