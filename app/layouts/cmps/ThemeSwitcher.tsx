"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = ({ className }: { className: string }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`theme-switcher ${className} flex items-center justify-center`}
    >
      <span>theme-switcher</span>
      <input
        id="theme-switcher"
        type="checkbox"
        checked={mounted && (theme === "dark" || resolvedTheme === "dark")}
        onClick={() =>
          setTheme(
            theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
          )
        }
        readOnly
      />
    </div>
  );
};

export default ThemeSwitcher;
