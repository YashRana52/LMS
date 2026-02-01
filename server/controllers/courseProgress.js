import { Course } from "../models/course.js";
import { CourseProgress } from "../models/CourseProgress.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const userId = req.id;

    //step-1 fetch user course progress

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    //step 2 if no progress found ,return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }
    //step 3 return user the course progree along with details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (l) => l.lectureId.toString() === lectureId,
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    const course = await Course.findById(courseId);

    const completedLecturesCount = new Set(
      courseProgress.lectureProgress
        .filter((lp) => lp.viewed)
        .map((lp) => lp.lectureId.toString()),
    ).size;

    if (course.lectures.length === completedLecturesCount) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    res.status(200).json({
      message: "Lecture progress updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      return res.status(400).json({
        message: "course progress not found",
      });
    }

    courseProgress.lectureProgress.map(
      (lectureProg) => (lectureProg.viewed = true),
    );
    courseProgress.completed = true;
    await courseProgress.save();

    return res.status(200).json({
      message: "Course mark as completed",
    });
  } catch (error) {
    console.log(error);
  }
};
export const markAsUnCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      return res.status(400).json({
        message: "course progress not found",
      });
    }

    courseProgress.lectureProgress.map(
      (lectureProg) => (lectureProg.viewed = false),
    );
    courseProgress.completed = false;
    await courseProgress.save();

    return res.status(200).json({
      message: "Course mark as incompleted",
    });
  } catch (error) {
    console.log(error);
  }
};
