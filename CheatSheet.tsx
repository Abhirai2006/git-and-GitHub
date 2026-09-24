"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Search } from "lucide-react";
import { commandReference } from "@/lib/commandData";

export default function CheatSheet() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commandReference;
    return commandReference.filter(
      (c) => c.command.toLowerCase().includes(q) || c.purpose.toLowerCase().includes(q)
    );
  }, [query]);

  const categories = useMemo(() => {
    const set = new Set(filtered.map((c) => c.category));
    return Array.from(set);
  }, [filtered]);

  const copy = async (command: string, id: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
    } catch {
      // clipboard blocked, ignore silently
    }
  };

  return (
    <div>
      <div className="relative max-w-md mb-10">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands, e.g. rebase, tag, revert"
          className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-muted">Nothing matches &ldquo;{query}&rdquo;. Try a shorter word.</p>
      )}

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-display text-xl font-medium mb-4">{cat}</h3>
            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {filtered
                .filter((c) => c.category === cat)
                .map((c) => {
                  const id = `${cat}-${c.command}`;
                  return (
                    <div
                      key={id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-background hover:bg-panel transition-colors"
                    >
                      <div className="min-w-0">
                        <code className="font-mono text-sm sm:text-[15px] text-accent break-all">
                          {c.command}
                        </code>
                        <p className="text-sm text-muted mt-1">{c.purpose}</p>
                      </div>
                      <button
                        onClick={() => copy(c.command, id)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium hover:border-accent transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copiedId === id ? (
                            <motion.span
                              key="copied"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1.5 text-green"
                            >
                              <Check size={13} /> Copied
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1.5"
                            >
                              <Copy size={13} /> Copy
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
