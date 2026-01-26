import { Course } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utills/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({ creator: userId });

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this creator",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("getCreatorCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load courses",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const {
      description,
      subTitle,
      courseTitle,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    const thumbnail = req.file;
    const courseId = req.params.courseId;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 🔄 thumbnail update
    if (thumbnail) {
      // delete old image
      if (course.thumbnailPublicId) {
        await deleteMediaFromCloudinary(course.thumbnailPublicId);
      }

      // upload new image
      const uploadResult = await uploadMedia(
        thumbnail.buffer,
        "courses/thumbnails",
      );

      course.courseThumbnail = uploadResult.secure_url;
      course.thumbnailPublicId = uploadResult.public_id;
    }

    // update other fields
    course.courseTitle = courseTitle ?? course.courseTitle;
    course.description = description ?? course.description;
    course.subTitle = subTitle ?? course.subTitle;
    course.category = category ?? course.category;
    course.courseLevel = courseLevel ?? course.courseLevel;
    course.coursePrice = coursePrice ?? course.coursePrice;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("editCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title and course ID are required",
      });
    }
    // create lecture

    const lecture = await Lecture.create({
      lectureTitle,
    });

    // add lecture to course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("createLecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: " course ID are required",
      });
    }
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("getLecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    //update lecture
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo?.videoUrl) {
      lecture.videoUrl = videoInfo.videoUrl;
    }
    if (videoInfo?.publicId) {
      lecture.videoPublicId = videoInfo.publicId;
    }

    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();
    //ensure the course still has the lecture id if was't olready added

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lectureId)) {
      course.lectures.push(lectureId);

      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("editLecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // 🎥 delete video from cloudinary FIRST
    if (lecture.videoPublicId) {
      await deleteVideoFromCloudinary(lecture.videoPublicId);
    }

    // 🗑️ delete lecture from DB
    await Lecture.findByIdAndDelete(lectureId);

    // 🔗 remove lecture reference from course
    await Course.updateOne(
      { _id: courseId },
      { $pull: { lectures: lectureId } },
    );

    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.error("removeLecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("getLectureById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

// publish unpublish course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //true ,false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }
    // publish status based on the query parameter
    course.isPublished = publish === "true";

    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";

    return res.status(200).json({
      message: `Course is ${statusMessage} `,
    });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
export const getPublishCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        courses: [],
        message: "No published courses found",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to find published course",
    });
  }
};
