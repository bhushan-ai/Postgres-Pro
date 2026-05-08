import cloudinary, { v2 } from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const uploadImageToCloudinary = async (b64: string) => {
  try {
    const result = await cloudinary.v2.uploader.upload(b64);
    console.log("Uploaded Successfully", result.secure_url);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

const upload = multer({ storage });

export { upload, uploadImageToCloudinary };
