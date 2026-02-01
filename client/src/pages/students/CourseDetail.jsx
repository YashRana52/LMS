import ByCourseButton from "@/components/ByCourseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchase";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>failed to reload details</h1>;
  }

  const { course, purchased } = data;
  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="mt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1c1d1f] to-[#2d2f31] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">
            {course?.courseTitle}
          </h1>

          <p className="text-lg text-gray-300">{course?.subTitle}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <p>
              Created By:
              <span className="text-[#C0C4FC] underline italic">
                {course?.creator.name}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <BadgeInfo size={16} />
              <span>Last updated {course?.createdAt.split("T")[0]} </span>
            </div>

            <p> students enrolled {course?.enrolledStudents.length}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* ===== Left Section ===== */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-2">About this course</h2>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
          </div>

          {/* Course Content */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Course Content
              </CardTitle>
              <CardDescription>
                5 Lectures • Total length 2h 30m
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 text-sm">
                    {true ? (
                      <PlayCircle size={16} className="text-green-600" />
                    ) : (
                      <Lock size={16} className="text-gray-400" />
                    )}
                    <span>{lecture.lectureTitle}</span>
                  </div>
                  <span className="text-xs text-gray-500">12:30</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/*  Right Section   */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-lg sticky top-24">
            <CardContent className="p-4 space-y-4">
              {/* Video Preview */}
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={course.lectures[0].videoUrl}
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <h3 className="font-semibold">Lecture Preview</h3>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold">₹999</h2>
                <p className="text-sm text-gray-500">Full lifetime access</p>
              </div>
            </CardContent>

            <CardFooter className="p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <ByCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
