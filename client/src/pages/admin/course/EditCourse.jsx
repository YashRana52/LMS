import { Button } from "@/components/ui/button";

import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

function EditCourse() {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-2xl">
          Add details information regarding the course
        </h1>
        <Link to="lecture">
          <Button variant="link" className={"hover:text-blue-600"}>
            Go to Courses Lecture
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
}

export default EditCourse;
