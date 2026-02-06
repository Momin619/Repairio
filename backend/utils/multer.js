import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream";

// Multer memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Cloudinary upload helper
export const uploadToCloudinary = (fileBuffer, folder = "repairio") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(stream);
  });
};
