import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * A toggle switch (label + track) for use inside a settings row.
 * Pass `compact` for an icon-only button (used in the sidebar).
 */
export default function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        isDark ? "bg-cyan-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
          isDark ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      >
        {isDark ? <Moon size={12} className="text-gray-200" /> : <Sun size={12} className="text-gray-400" />}
      </span>
    </button>
  );
}
