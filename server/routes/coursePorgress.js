import express from "express";
import protect from "../middlewares/auth.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsUnCompleted,
  updateLectureProgress,
} from "../controllers/courseProgress.js";

const courseProgress = express.Router();

courseProgress.get("/:courseId", protect, getCourseProgress);
courseProgress.post(
  "/:courseId/lecture/:lectureId/view",
  protect,
  updateLectureProgress,
);
courseProgress.post("/:courseId/complete", protect, markAsCompleted);
courseProgress.post("/:courseId/incomplete", protect, markAsUnCompleted);

export default courseProgress;
