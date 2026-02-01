import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:3000/api/stripe";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/details-with-status`,
        method: "GET",
      }),
    }),
    getAllPurchasedCourse: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetAllPurchasedCourseQuery,
  useGetCourseDetailsWithStatusQuery,
} = purchaseApi;
