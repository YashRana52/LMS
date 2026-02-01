import React from "react";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <SearchX className="h-10 w-10 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        No courses found
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
        We couldn’t find any courses right now. Try browsing all courses or
        explore popular ones.
      </p>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/">Browse all courses</Link>
        </Button>

        <Button asChild>
          <Link to="/courses">Explore popular</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseNotFound;
