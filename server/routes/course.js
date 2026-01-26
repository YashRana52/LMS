import express from "express";
import protect from "../middlewares/auth.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishCourse,
  removeLecture,
  togglePublishCourse,
} from "../controllers/course.js";
import upload from "../utills/multer.js";

const courseRouter = express.Router();

courseRouter.post("/create", protect, createCourse);
courseRouter.get("/get", protect, getCreatorCourses);
courseRouter.put(
  "/edit/:courseId",
  protect,
  upload.single("courseThumbnail"),
  editCourse,
);
courseRouter.get("/published-courses", getPublishCourse);
courseRouter.get("/:courseId", protect, getCourseById);
courseRouter.post("/:courseId/lecture", protect, createLecture);
courseRouter.get("/:courseId/lecture", protect, getCourseLecture);

courseRouter.post("/:courseId/lecture/:lectureId", protect, editLecture);
courseRouter.delete("/lecture/:lectureId", protect, removeLecture);
courseRouter.get("/lecture/:lectureId", protect, getLectureById);
courseRouter.patch("/:courseId", protect, togglePublishCourse);

export default courseRouter;
