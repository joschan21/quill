"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-2 pr-4">
      {theme === "light" ? (
        <span role="img" aria-label="sun">
          ☀️
        </span>
      ) : (
        <span role="img" aria-label="moon">
          🌙
        </span>
      )}

      <Switch
        checked={theme === "light"}
        onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative mt-0 h-5 w-10 rounded-full  bg-gray-400 transition duration-150 ease-in-out dark:bg-gray-600 md:mb-0 md:mt-1   "
      />
    </div>
  );
};

export default ThemeSwitcher;
