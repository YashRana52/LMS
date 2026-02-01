import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const CourseSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="rounded-2xl overflow-hidden animate-pulse">
          {/* Thumbnail */}
          <div className="h-40 w-full bg-gray-200 dark:bg-gray-700" />

          <CardContent className="p-4 space-y-3">
            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Subtitle */}
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Instructor */}
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Footer */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseSkeleton;
