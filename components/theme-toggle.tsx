"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <button 
        className="p-2 rounded-lg"
      >
        <Moon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg hover:bg-[var(--surface-stat)] transition-colors"
    >
      {isDark ? (
        <Sun className="h-5 w-5" style={{ color: "var(--foreground)" }} />
      ) : (
        <Moon className="h-5 w-5" style={{ color: "var(--foreground)" }} />
      )}
    </button>
  );
}