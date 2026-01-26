import LoadingSpinner from "@/components/LoadingSpinner";
import RichtextEditor from "@/components/RichtextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseTab() {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = params.courseId;

  const [publishCourse] = usePublishCourseMutation();

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: null,
  });

  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const isPublished = courseByIdData?.course?.isPublished;

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const selectCourseLevel = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInput((prev) => ({ ...prev, courseThumbnail: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateCourseHandler = async () => {
    const formdata = new FormData();
    formdata.append("courseTitle", input.courseTitle);
    formdata.append("subTitle", input.subTitle);
    formdata.append("description", input.description);
    formdata.append("category", input.category);
    formdata.append("courseLevel", input.courseLevel);
    formdata.append("coursePrice", input.coursePrice);

    if (input.courseThumbnail) {
      formdata.append("courseThumbnail", input.courseThumbnail);
    }

    await editCourse({ formdata, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const res = await publishCourse({ courseId, query: action });
      if (res?.data) {
        toast.success(res.data.message || "Updated");
        refetch();
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed to publish or unpublish course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully");
      navigate(-1);
    }

    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error, data, navigate]);

  useEffect(() => {
    if (courseByIdData && !courseByIdLoading) {
      setInput({
        courseTitle: courseByIdData.course.courseTitle || "",
        subTitle: courseByIdData.course.subTitle || "",
        description: courseByIdData.course.description || "",
        category: courseByIdData.course.category || "",
        courseLevel: courseByIdData.course.courseLevel || "",
        coursePrice: courseByIdData.course.coursePrice || "",
        courseThumbnail: null,
      });

      setPreviewThumbnail(courseByIdData.course.thumbnailUrl || "");
    }
  }, [courseByIdData, courseByIdLoading]);

  if (courseByIdLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="border bg-gradient-to-b from-card to-card/80 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 pt-6 px-6 md:px-8 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Course Details
            </CardTitle>
            <CardDescription className="text-base mt-1.5">
              Update information and control course visibility
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              disabled={courseByIdData?.course?.lectures.length === 0}
              variant={isPublished ? "secondary" : "default"}
              size="sm"
              onClick={() =>
                publishStatusHandler(isPublished ? "false" : "true")
              }
              className="min-w-[110px]"
            >
              {isPublished ? "Unpublish" : "Publish Course"}
            </Button>

            <Button variant="destructive" size="sm" className="min-w-[110px]">
              Delete Course
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="courseTitle">Course Title</Label>
            <Input
              id="courseTitle"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subTitle">Subtitle</Label>
            <Input
              id="subTitle"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <div className="border rounded-xl overflow-hidden">
            <RichtextEditor input={input} setInput={setInput} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={selectCategory} value={input.category}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Popular Categories</SelectLabel>
                  {[
                    "Next JS",
                    "Frontend Development",
                    "Fullstack Development",
                    "MERN Stack Development",
                    "Javascript",
                    "Python",
                    "Data Science",
                    "Docker",
                    "MongoDB",
                    "HTML / CSS",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Course Level</Label>
            <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price (₹)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Course Thumbnail</Label>
          <Input type="file" accept="image/*" onChange={selectThumbnail} />

          {previewThumbnail && (
            <img
              src={previewThumbnail}
              alt="Preview"
              className="w-64 h-40 object-cover rounded-xl"
            />
          )}
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button disabled={isLoading} onClick={updateCourseHandler}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
