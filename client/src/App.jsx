import React from "react";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Hero from "./pages/students/Hero";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/students/Courses";
import MyLearning from "./pages/students/MyLearning";
import Profile from "./pages/students/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/students/CourseDetail";
import CourseProgress from "./pages/students/CourseProgress";
import SearchPage from "./pages/students/SearchPage";
import {
  AdminRoute,
  AuthenticateUser,
  ProtectetRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticateUser>
            <Login />
          </AuthenticateUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectetRoute>
            <MyLearning />
          </ProtectetRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectetRoute>
            <Profile />
          </ProtectetRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectetRoute>
            <SearchPage />
          </ProtectetRoute>
        ),
      },
      {
        path: "course-details/:courseId",
        element: (
          <ProtectetRoute>
            <CourseDetail />
          </ProtectetRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectetRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectetRoute>
        ),
      },

      // admin routes statred from here
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider defaultTheme="system">
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
