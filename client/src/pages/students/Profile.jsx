import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

function Profile() {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { data: updateUserData, isLoading: isUpdating, isError, error, isSuccess },
  ] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  // preload name
  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, []);

  // toast handler
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated");
    }
    if (isError) {
      toast.error(error?.data?.message || "Profile update failed");
    }
  }, [isSuccess, isError, updateUserData, error]);

  if (isLoading || !data) {
    return <ProfileSkeleton />;
  }

  const { user } = data;

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  return (
    <div className="max-w-6xl mx-auto my-20 px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">Profile</h1>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white/70 dark:bg-gray-900/70 p-6 md:p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-32 md:w-32">
              <AvatarImage
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                className="object-cover"
              />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>

            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-0.5 rounded-full">
              {user?.role?.toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-700">{user?.email}</p>
            </div>

            {/* Edit Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full">Edit Profile</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Profile Photo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={updateUserHandler}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold mb-4">
        Courses you are enrolled in
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {user?.enrolledCourses?.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            You haven’t enrolled in any course yet 🚀
          </div>
        ) : (
          user?.enrolledCourses?.map((course) => (
            <Course key={course._id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto my-20 px-4">
      {/* Header */}
      <Skeleton className="h-10 w-40 mb-8" />

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-lg p-6 md:p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar Skeleton */}
          <Skeleton className="h-28 w-28 md:h-32 md:w-32 rounded-full" />

          {/* Info */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-48" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-64" />
            </div>

            <Skeleton className="h-10 w-36 rounded-full mt-2" />
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <Skeleton className="h-6 w-72 mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
