import React, { useState } from "react";
import Filter from "./Filter";
import CourseSkeleton from "@/components/CourseSkeleton";
import CourseNotFound from "@/components/CourseNotFound";
import SearchResult from "./SearchResult";
import { useGetSearchedCourseQuery } from "@/features/api/courseApi";
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const query = searchParams.get("query");
  const { data, isLoading } = useGetSearchedCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = ({ categories, sortByPrice }) => {
    setSelectedCategories(categories);
    setSortByPrice(sortByPrice);
  };

  return (
    <div className="max-w-7xl mx-auto md:p-8 mt-10">
      <div className="my-6 ">
        <p>
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row  gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses.map((course) => (
              <SearchResult course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
