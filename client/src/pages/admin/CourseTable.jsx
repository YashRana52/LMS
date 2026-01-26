import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit2, Edit2Icon, Plus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function CourseTable() {
  const { data, isLoading, error } = useGetCreatorCoursesQuery();
  const courses = data?.courses || [];
  console.log(courses);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <p className="text-red-500">Failed to load courses</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Courses
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and edit your published & draft courses
          </p>
        </div>

        <Link to="create">
          <Button className="rounded-xl shadow-md flex items-center">
            <Plus />
            <span> Create Course</span>
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border bg-background/60 backdrop-blur-md shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  No courses created yet 🚀
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course._id}
                  className="transition hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    ₹{course?.coursePrice || "NA"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                      className={
                        course.isPublished
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>

                  <TableCell className="max-w-[280px] truncate">
                    {course.courseTitle}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link to={`${course._id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-muted"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CourseTable;
