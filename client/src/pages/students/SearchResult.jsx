import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";
import { User, BarChart, Clock } from "lucide-react"; // ← add lucide-react icons (npm i lucide-react)

function SearchResult({ course }) {
  return (
    <Card
      className={`
        group relative overflow-hidden border border-gray-200/60 
        bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl 
        hover:-translate-y-1 transition-all duration-300 
        rounded-2xl mb-5
      `}
    >
      <div className="flex flex-col sm:flex-row gap-5 p-5">
        <Link
          to={`/course-detail/${course?._id}`}
          className="relative shrink-0 overflow-hidden rounded-2xl w-full sm:w-60 h-40 sm:h-44"
        >
          <img
            src={
              course?.courseThumbnail ||
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"
            }
            alt={course?.courseThumbnail || "Course thumbnail"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {course?.courseTitle || "Course Title"}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {course?.subTitle ||
                "A comprehensive course that takes you from beginner to pro in the most engaging way possible."}
            </p>
          </div>

          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mt-auto">
            <div className="flex items-center gap-1.5">
              <User size={16} className="text-gray-500" />
              <span className="font-medium text-gray-800">
                {course?.creator?.name || "Yash Rana"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <BarChart size={16} className="text-gray-500" />
              <span>{course?.courseLevel || "Beginner"}</span>
            </div>

            {course?.duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-gray-500" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>

          {/* Badges + Price */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="bg-white/80 border-gray-300 text-gray-700 font-medium px-3 py-1"
              >
                {course?.level || "Beginner"}
              </Badge>

              {course?.price === 0 ? (
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-3 py-1 shadow-sm">
                  Free
                </Badge>
              ) : course?.coursePrice ? (
                <Badge variant="secondary" className="font-semibold px-3 py-1">
                  ₹{course.coursePrice}
                </Badge>
              ) : null}
            </div>

            <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View Course →
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SearchResult;
