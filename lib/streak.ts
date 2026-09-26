// Duolingo-style day streak, computed and persisted client-side only.
// Call this once, on mount, from a client component.
export function computeAndStoreStreak(): number {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  let streak = 1;
  try {
    const lastVisit = window.localStorage.getItem("viva-last-visit");
    const storedStreak = Number(window.localStorage.getItem("viva-streak") || "0");

    if (lastVisit === todayKey) {
      // already counted today
      return storedStreak || 1;
    }

    if (lastVisit) {
      const last = new Date(lastVisit);
      const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
      streak = diffDays === 1 ? storedStreak + 1 : 1;
    }

    window.localStorage.setItem("viva-last-visit", todayKey);
    window.localStorage.setItem("viva-streak", String(streak));
  } catch {
    // localStorage unavailable, streak just won't persist
  }
  return streak;
}
