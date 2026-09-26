"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { computeAndStoreStreak } from "@/lib/streak";

export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    // The streak can only be computed from localStorage, which does not
    // exist during static rendering, so this sync-on-mount is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(computeAndStoreStreak());
  }, []);

  if (!streak) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden sm:flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
      title={`${streak} day streak, visit again tomorrow to keep it going`}
    >
      <Flame size={13} className="text-accent" />
      {streak}
    </motion.div>
  );
}
