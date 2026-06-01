import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
// Note: We use process.env to ensure this only runs on the server side
export function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn("Cloudinary environment variables are not fully configured.");
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to upload base64 images
export async function uploadImage(base64Image: string): Promise<string> {
  configureCloudinary();

  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "vayus_networks_products",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}
