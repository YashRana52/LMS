import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "datascience", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

function Filter({ handleFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  /* ---------------- CATEGORY CHANGE ---------------- */
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  /* ---------------- APPLY FILTER ---------------- */
  const applyFilters = () => {
    handleFilterChange?.({
      categories: selectedCategories,
      sortByPrice: sortOrder,
    });
  };

  /* ---------------- CLEAR FILTER ---------------- */
  const clearFilters = () => {
    setSelectedCategories([]);
    setSortOrder("");
    handleFilterChange?.({
      categories: [],
      sortByPrice: "",
    });
  };

  return (
    <div className="w-full md:w-[22%] rounded-2xl border bg-white dark:bg-gray-900 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Filters</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-gray-500"
        >
          Clear
        </Button>
      </div>

      {/* Sort */}
      <div className="mt-4 space-y-2">
        <Label className="text-sm text-gray-600">Sort by price</Label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="low">Low → High</SelectItem>
              <SelectItem value="high">High → Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-5" />

      {/* Categories */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        <Label className="text-sm text-gray-600">Categories</Label>

        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label htmlFor={category.id} className="text-sm cursor-pointer">
              {category.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <Button
        className="w-full mt-5"
        onClick={applyFilters}
        disabled={!selectedCategories.length && !sortOrder}
      >
        Apply Filters
      </Button>
    </div>
  );
}

export default Filter;
