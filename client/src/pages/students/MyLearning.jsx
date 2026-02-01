import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

function MyLearning() {
  const { data, isLoading } = useLoadUserQuery();

  const MyLearning = data?.user.enrolledCourses || [];
  return (
    <div className="max-w-4xl mx-auto my-20 px-4 md:px-0">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        My Learning
      </h1>

      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : MyLearning.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You are not enrolled in any course
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MyLearning.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="
          relative overflow-hidden rounded-2xl
          border border-gray-200/60 dark:border-gray-800
          bg-white dark:bg-gray-900
          shadow-sm
        "
      >
        {/* Image Skeleton */}
        <div className="h-44 w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />

        <div className="p-5 space-y-4">
          {/* Title */}
          <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />

          {/* Author */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-3 w-24 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-5 w-16 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-10 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    ))}
  </div>
);
