"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Reading persisted state after mount is the correct, unavoidable
      // pattern here: localStorage does not exist during static rendering,
      // so the value can only be known once we're running in the browser.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (item !== null) setValue(JSON.parse(item) as T);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function" ? (newValue as (p: T) => T)(prev) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // storage might be unavailable, fail silently
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
