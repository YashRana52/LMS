import express from "express";
import upload from "../utills/multer.js";
import { uploadMedia } from "../utills/cloudinary.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Video upload failed",
    });
  }
});
export default mediaRouter;
