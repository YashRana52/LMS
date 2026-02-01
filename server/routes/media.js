import express from "express";
import upload from "../utills/multer.js";
import { uploadMedia } from "../utills/cloudinary.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 🔥 Cloudinary streaming-safe upload
    const result = await uploadMedia(req.file.buffer, "lms");

    return res.status(200).json({
      success: true,

      // 🔥 ALWAYS send secure_url for video playback
      secure_url: result.secure_url,

      // 🔥 required for delete/update
      public_id: result.public_id,

      // optional but useful
      duration: result.duration,

      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Video upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Video upload failed",
    });
  }
});

export default mediaRouter;
