import CheatSheet from "@/components/CheatSheet";

export default function CheatSheetPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="eyebrow">Cheat sheet</span>
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mt-4 mb-10">
        Every command, one search away.
      </h1>
      <CheatSheet />
    </section>
  );
}
