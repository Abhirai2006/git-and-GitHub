import CheatSheet from "@/components/CheatSheet";

export default function CheatSheetPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="text-sm font-semibold text-accent">Cheat sheet</span>
      <h1 className="font-display text-3xl sm:text-4xl font-medium mt-2 mb-10">
        Every command, one search away.
      </h1>
      <CheatSheet />
    </section>
  );
}
