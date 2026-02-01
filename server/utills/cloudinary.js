import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = (buffer, folder = "lms") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "video", // 🔥 MUST
          chunk_size: 6 * 1024 * 1024, // 🔥 enables byte-range streaming
          eager_async: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export const deleteMediaFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export const deleteVideoFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
  });
};
