import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseProgress() {
  const params = useParams();

  const courseId = params.courseId;
  const [currentLecture, setCurrentLecture] = useState();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureprogress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markIncompleteData, isSuccess: incompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (incompletedSuccess) {
      refetch();
      toast.success(markIncompleteData.message);
    }
  }, [completedSuccess, incompletedSuccess]);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <p>failed to load details</p>;
  }

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;
  console.log(courseDetails);

  //initialise the first lecure if not exist

  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };
  const handleLectureprogress = async (lectureId) => {
    if (!lectureId || !courseId) return;

    await updateLectureprogress({ courseId, lectureId }).unwrap();
    refetch();
  };
  //handle select specific lecture to watch

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureprogress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {courseTitle}
        </h1>

        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          className={`rounded-full px-6 py-2 font-medium transition-all
        ${
          completed
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
        }
      `}
        >
          {completed ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} /> <span>Completed</span>
            </div>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Section */}
        <div className="flex-1 lg:w-3/5 rounded-2xl border bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg p-5">
          <video
            controls
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            className="w-full rounded-xl shadow-md"
            onPlay={() =>
              handleLectureprogress(currentLecture?._id || initialLecture?._id)
            }
          />

          {/* Current Lecture Title */}
          <div className="mt-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              Lecture{" "}
              {courseDetails?.lectures?.findIndex(
                (lec) =>
                  lec?._id === (currentLecture?._id || initialLecture?._id),
              ) + 1}
              :{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {currentLecture?.lectureTitle || initialLecture?.lectureTitle}
              </span>
            </h3>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-2/5 rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-2xl shadow-xl p-6">
          <h2 className="font-bold text-2xl mb-5 text-gray-900 dark:text-white tracking-tight">
            Course Lectures
          </h2>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300/70 dark:scrollbar-thumb-gray-700/70">
            {courseDetails?.lectures?.map((lecture, index) => {
              const isActive = lecture?._id === currentLecture?._id;
              const completed = isLectureCompleted(lecture?._id);

              return (
                <Card
                  key={lecture?._id}
                  onClick={() => handleSelectLecture(lecture)}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-400 shadow-md"
                : "bg-white/70 dark:bg-gray-900/70 hover:bg-indigo-50/60 dark:hover:bg-gray-800"
            }
          `}
                >
                  <CardContent className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div
                        className={`flex items-center justify-center h-9 w-9 rounded-full
                  ${
                    completed
                      ? "bg-green-100 text-green-600"
                      : isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }
                `}
                      >
                        {completed ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <CirclePlay size={18} />
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <CardTitle className="text-md font-semibold text-gray-600 dark:text-gray-200 line-clamp-1">
                          {lecture?.lectureTitle}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Lecture {index + 1}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    {completed && (
                      <Badge className="rounded-full bg-green-500/10 text-green-600 px-3 py-1 text-xs">
                        ✓ Done
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseProgress;
