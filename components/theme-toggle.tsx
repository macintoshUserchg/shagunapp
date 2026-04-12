"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <button 
      onClick={toggle} 
      aria-label="Toggle theme" 
      className="p-2 rounded-lg hover:bg-[var(--surface-stat)] transition-colors"
    >
      {dark ? (
        <Sun className="h-5 w-5" style={{ color: "var(--foreground)" }} />
      ) : (
        <Moon className="h-5 w-5" style={{ color: "var(--foreground)" }} />
      )}
    </button>
  );
}