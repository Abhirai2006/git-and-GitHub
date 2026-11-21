import { commandReference } from "@/lib/commandData";

// Two tilted strips of commands scrolling in opposite directions.
export default function CommandMarquee() {
  const items = commandReference.map((c) => c.command);
  const half = Math.ceil(items.length / 2);
  const rows = [
    { list: items, cls: "bg-pop-sun text-ink -rotate-[1.5deg]", dir: "", dot: "text-pop-pink" },
    { list: [...items.slice(half), ...items.slice(0, half)], cls: "bg-ink text-white rotate-[1deg] -mt-3", dir: "[animation-direction:reverse]", dot: "text-pop-lime" },
  ];

  return (
    <div className="relative py-8 overflow-hidden">
      {rows.map((r, ri) => (
        <div key={ri} className={`relative border-y-[2.5px] border-ink py-3.5 ${r.cls}`} style={{ width: "104%", marginLeft: "-2%" }}>
          <div className={`flex w-max animate-marquee ${r.dir}`}>
            {[r.list, r.list].map((set, setIdx) => (
              <div key={setIdx} className="flex shrink-0">
                {set.map((cmd, i) => (
                  <span key={`${setIdx}-${i}`} className="flex items-center gap-4 px-4 font-mono text-sm sm:text-base font-bold whitespace-nowrap">
                    <span className={r.dot}>✦</span>
                    {cmd}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
