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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:3000/api/media";

function LectureTab() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [editLecture, { isLoading, isSuccess, error, data }] =
    useEditLectureMutation();
  const [removeLecture, { isLoading: removing, isSuccess: removed }] =
    useRemoveLectureMutation();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsFree(lecture.isPreviewFree || false);
      setUploadVideoInfo(
        lecture.videoUrl
          ? {
              videoUrl: lecture.videoUrl,
              publicId: lecture.publicId,
            }
          : null,
      );
    }
  }, [lecture]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated");
      navigate(-1);
    }
    if (error) toast.error("Failed to update lecture");
  }, [isSuccess, error, data]);

  useEffect(() => {
    if (removed) {
      toast.success("Lecture removed");
      navigate(-1);
    }
  }, [removed, navigate]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setMediaProgress(true);
    setUploadProgress(0);

    try {
      const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) =>
          setUploadProgress(Math.round((loaded / total) * 100)),
      });

      setUploadVideoInfo({
        videoUrl: res.data.secure_url,
        publicId: res.data.public_id,
      });

      toast.success("Video uploaded successfully");
    } catch {
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const editLectureHandler = async () => {
    if (!lectureTitle || !uploadVideoInfo) {
      return toast.error("Title & video are required");
    }

    await editLecture({
      lectureTitle,
      courseId,
      lectureId,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    });
  };

  return (
    <Card className="rounded-2xl shadow-lg border bg-card overflow-hidden">
      <CardHeader className="px-6 py-5 border-b bg-muted/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Edit Lecture
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Update lecture details, video, and visibility settings
            </CardDescription>
          </div>

          <Button
            variant="destructive"
            size="sm"
            disabled={removing}
            onClick={() => removeLecture(lectureId)}
            className="min-w-[90px]"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete Lecture"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="lecture-title" className="font-medium">
            Lecture Title <span className="text-red-500 text-xs">*</span>
          </Label>
          <Input
            id="lecture-title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. Introduction to React Hooks & Context API"
            className="h-10"
          />
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <Label htmlFor="video-upload" className="font-medium">
            Lecture Video <span className="text-red-500 text-xs">*</span>
          </Label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={fileChangeHandler}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Video className="h-5 w-5" />
              <span>MP4, WebM • Max 2GB recommended</span>
            </div>
          </div>

          {mediaProgress && (
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Free Preview Toggle */}
        <div className="flex items-center justify-between border rounded-xl p-5 bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="space-y-0.5">
            <Label className="font-medium">Free Preview</Label>
            <p className="text-sm text-muted-foreground">
              Students can watch this lecture without purchasing the course
            </p>
          </div>
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="sm:min-w-[110px]"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading || !lectureTitle.trim() || !uploadVideoInfo}
            onClick={editLectureHandler}
            className="sm:min-w-[140px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Save & Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LectureTab;
