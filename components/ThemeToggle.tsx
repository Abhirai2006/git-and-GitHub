"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("viva-theme");
    const initial = stored === "dark" ? "dark" : "light";
    // The real theme is only knowable client-side, after mount, so this
    // sync-on-mount effect is intentional rather than something to memoize.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("viva-theme", next);
  };

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="relative h-10 w-10 rounded-full border-[2.5px] border-line flex items-center justify-center overflow-hidden hover:bg-pop-sun hover:text-ink transition-colors cursor-pointer"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {theme === "dark" ? (
          <Moon size={16} strokeWidth={2} />
        ) : (
          <Sun size={16} strokeWidth={2} />
        )}
      </motion.div>
    </button>
  );
}
