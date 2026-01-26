// src/components/admin/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "course",
      label: "Courses",
      icon: BookOpen,
    },
  ];

  return (
    <div className="hidden lg:flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-gray-200 dark:border-gray-800",
          "bg-white dark:bg-gray-950",
          "transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-16",
          "flex flex-col",
        )}
      >
        {/* Header / Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {expanded && (
            <span className="text-lg font-semibold tracking-tight">Admin</span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-500 dark:text-gray-400",
              "transition-colors",
              !expanded && "mx-auto",
            )}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "flex-shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400",
                    !expanded && "mx-auto",
                  )}
                />

                {expanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {expanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            yashrana• © 2026
          </div>
        )}
      </aside>

      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 md:p-24 p-2">
        <Outlet />
      </div>
    </div>
  );
}
