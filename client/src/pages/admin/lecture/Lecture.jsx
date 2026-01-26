import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Lecture({ lecture, index, courseId }) {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <div
      onClick={goToUpdateLecture}
      className="group flex items-center justify-between rounded-xl border bg-background px-4 py-3
                 cursor-pointer transition-all hover:shadow-md hover:border-primary"
    >
      {/* Left */}
      <div className="flex items-center gap-3 overflow-hidden">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full
                         bg-primary/10 text-sm font-semibold text-primary"
        >
          {index + 1}
        </span>

        <p className="truncate font-medium text-foreground">
          {lecture.lectureTitle}
        </p>
      </div>

      {/* Edit button (hover only) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToUpdateLecture();
        }}
        className="opacity-0 scale-95 transition-all duration-200
                   group-hover:opacity-100 group-hover:scale-100
                   rounded-md p-2 text-muted-foreground
                   hover:bg-primary/10 hover:text-primary"
        aria-label="Edit lecture"
      >
        <Edit size={18} />
      </button>
    </div>
  );
}

export default Lecture;
