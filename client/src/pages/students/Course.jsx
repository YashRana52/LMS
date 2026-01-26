import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import React from "react";
import { Link } from "react-router-dom";

function Course({ course }) {
  //discount price
  const originalPrice = course?.coursePrice || 0;
  const discountPercent = 25;

  const discountedPrice = Math.round(
    originalPrice + (originalPrice * discountPercent) / 100,
  );

  return (
    <Link to={`/course-details/${course._id}`}>
      <Card
        className={`
        group relative overflow-hidden rounded-2xl border border-gray-200/60 
        bg-white/70 dark:bg-gray-900/70 
        backdrop-blur-sm shadow-lg shadow-black/5 dark:shadow-black/40
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-indigo-500/15
        hover:-translate-y-2 hover:scale-[1.02]
        dark:border-gray-800/60
      `}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            className={`
            h-full w-full object-cover transition-transform duration-700 
            group-hover:scale-110
          `}
            src={course?.courseThumbnail}
            alt="Reactjs Complete Course"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500" />

          <div
            className={`
            absolute inset-0 opacity-0 group-hover:opacity-30 
            bg-linear-to-r from-transparent via-white/30 to-transparent 
            -translate-x-full group-hover:translate-x-full 
            transition-transform duration-1200 ease-out
          `}
          />
        </div>

        <CardContent className="relative space-y-4 p-5">
          <h3
            className={`
            line-clamp-2 font-semibold text-xl leading-tight 
            text-gray-900 dark:text-gray-100
            group-hover:text-indigo-600 dark:group-hover:text-indigo-400
            transition-colors duration-300
          `}
          >
            {course.courseTitle}
          </h3>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-background transition-transform group-hover:scale-110">
                <AvatarImage
                  src={course.creator.photoUrl || "https:github.com/shadcn.png"}
                  alt="Yash Rana"
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  YA
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {course.creator.name}
              </span>
            </div>

            <Badge
              variant="outline"
              className={`
              border-none bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white px-3 py-1 text-xs font-semibold 
              shadow-sm shadow-indigo-500/30
            `}
            >
              {course?.courseLevel}
            </Badge>
          </div>

          {/* Price – bigger & more prominent */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{course.coursePrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ₹{discountedPrice}
            </span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              25% off
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Course;
