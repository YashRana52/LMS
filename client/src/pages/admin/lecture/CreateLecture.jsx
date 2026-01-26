import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

function CreateLecture() {
  const navigate = useNavigate();
  const courseId = window.location.pathname.split("/")[3];

  const [lectureTitle, setLectureTitle] = useState("");

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch: lectureRefetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ courseTitle: lectureTitle, courseId });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture created successfully");
      lectureRefetch();
      setLectureTitle("");
    }
    if (error) {
      toast.error(error.data.message || "Failed to create lecture");
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Let's add a lecture to your course
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide a title for your lecture
        </p>
      </div>

      {/* Form Card */}
      <div className="space-y-6 rounded-2xl border bg-background p-6 shadow-sm">
        {/* Title */}
        <div className="space-y-2">
          <Label>Lecture Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. Complete MERN Stack Bootcamp"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Course
          </Button>

          <Button
            onClick={createLectureHandler}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Lecture..
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>
      {/* show lecture data */}
      <div className="mt-10">
        {lectureLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : lectureError ? (
          <p className="text-red-500 text-center">Failed to load lectures</p>
        ) : lectureData?.lectures?.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No lectures available yet
          </p>
        ) : (
          <div className="space-y-4">
            {lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                index={index}
                courseId={courseId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLecture;
