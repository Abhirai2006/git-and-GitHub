import { commandReference } from "@/lib/commandData";

export default function CommandMarquee() {
  // one pass through the reference, doubled below for a seamless loop
  const items = commandReference.map((c) => c.command);

  return (
    <div className="border-y border-border bg-ink py-4 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {[items, items].map((set, setIdx) => (
          <div key={setIdx} className="flex shrink-0">
            {set.map((cmd, i) => (
              <span
                key={`${setIdx}-${i}`}
                className="flex items-center font-mono text-sm text-term/70 px-6 whitespace-nowrap"
              >
                {cmd}
                <span className="ml-6 text-accent-soft">&bull;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
