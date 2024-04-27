import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "./theme-provider";

export const DarkModeToggler = () => {
  const { setTheme, theme } = useTheme();

  if (theme === "dark") {
    return (
      <SunIcon
        className="h-6 w-6 cursor-pointer"
        onClick={() => setTheme("light")}
      />
    );
  }

  if (theme === "light") {
    return (
      <MoonIcon
        className="h-6 w-6 cursor-pointer"
        onClick={() => setTheme("dark")}
      />
    );
  }
};
