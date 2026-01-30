import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function Hero() {
  return (
    <section className="relative mt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20" />

      {/* Content */}
      <div className="relative px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Learn Skills That <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400">
              Shape Your Future
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            Discover industry-ready courses, learn from experts, and upgrade
            your skills at your own pace.   
          </p>

          {/* Search */}
          <form className="mt-10 flex items-center gap-2 bg-white/90 dark:bg-gray-900/70 backdrop-blur-md rounded-full shadow-xl max-w-2xl mx-auto px-3 py-2">
            <Input
              placeholder="Search courses, skills, or instructors..."
              className="flex-1 border-none bg-transparent focus-visible:ring-0 text-gray-800 dark:text-gray-100 px-4"
            />
            <Button className="rounded-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              Search 
            </Button>
          </form>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button
              className="
      rounded-full px-8 py-3
      bg-white text-indigo-600 font-semibold
      shadow-lg
      hover:bg-indigo-50
      hover:shadow-2xl
      hover:-translate-y-0.5
      transition-all duration-300
    "
            >
              Explore Courses
            </Button>

            <Button
              variant="outline"
              className="
      rounded-full px-8 py-3
      border border-white/60
      text-white
      bg-white/10 backdrop-blur-md
      hover:bg-white
      hover:text-indigo-600
      hover:border-white
      hover:-translate-y-0.5
      transition-all duration-300
    "
            >
              Become an Instructor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
