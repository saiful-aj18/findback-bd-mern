import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TopBar({ title, back = false, right = null }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-100 bg-white/95 px-4 py-3.5 backdrop-blur safe-top">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <h1 className="flex-1 truncate text-[17px] font-bold text-gray-900">{title}</h1>
      {right}
    </header>
  );
}
