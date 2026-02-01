// ProtectedRoute.js

import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchase";
import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-details/${courseId}`} />
  );
};

export default PurchaseCourseProtectedRoute;
