import FlashcardDeck from "@/components/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="sticker inline-block -rotate-2 rounded-lg bg-pop-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">Flashcards</span>
      <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] mt-5 mb-10">
        Flip through every viva question.
      </h1>
      <FlashcardDeck />
    </section>
  );
}
