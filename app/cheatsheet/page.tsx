import CheatSheet from "@/components/CheatSheet";

export default function CheatSheetPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="sticker inline-block -rotate-2 rounded-lg bg-pop-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">Cheat sheet</span>
      <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] mt-5 mb-10">
        Every command, one search away.
      </h1>
      <CheatSheet />
    </section>
  );
}
