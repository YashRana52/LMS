import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

function Courses() {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();
  console.log(data);

  if (isError) {
    return <h1>Some error occured while fetching courses</h1>;
  }

  return (
    <div className="bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Our Courses
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Learn from industry-ready courses crafted by professionals
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;

const CourseSkeleton = () => {
  return (
    <div
      className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)]
"
    >
      <Skeleton className="h-44 w-full rounded-b-none rounded-t-2xl animate-pulse" />

      <div className="p-5 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-[85%] rounded-md" />
        <Skeleton className="h-4 w-[60%] rounded-md" />

        {/* Author + Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-10 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
};
