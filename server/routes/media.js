import express from "express";
import upload from "../utills/multer.js";
import { uploadMedia } from "../utills/cloudinary.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadMedia(req.file.buffer); // <-- use buffer
    res.status(200).json({
      success: true,
      data: result,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message, // optional for debugging
    });
  }
});

export default mediaRouter;
