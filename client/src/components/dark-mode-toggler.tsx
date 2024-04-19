"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export const DarkModeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // TODO: add skeleton
  if (!mounted) return;

  if (resolvedTheme === "dark") {
    return (
      <SunIcon
        className="h-8 w-8 hover:animate-pulse cursor-pointer"
        onClick={() => setTheme("light")}
      />
    );
  }

  if (resolvedTheme === "light") {
    return (
      <MoonIcon
        className="h-8 w-8 hover:animate-pulse cursor-pointer"
        onClick={() => setTheme("dark")}
      />
    );
  }
};
