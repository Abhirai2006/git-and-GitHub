import { commandReference } from "@/lib/commandData";

// A single quiet strip of every command from the twelve experiments.
export default function CommandMarquee() {
  const items = commandReference.map((c) => c.command);
  return (
    <div className="border-b border-border py-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" aria-hidden>
      <div className="flex w-max animate-marquee">
        {[items, items].map((set, setIdx) => (
          <div key={setIdx} className="flex shrink-0">
            {set.map((cmd, i) => (
              <span key={`${setIdx}-${i}`} className="px-6 font-mono text-[13px] text-muted whitespace-nowrap">
                {cmd}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
