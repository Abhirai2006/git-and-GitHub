import FlashcardDeck from "@/components/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="eyebrow">Flashcards</span>
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mt-4 mb-10">
        Flip through every viva question.
      </h1>
      <FlashcardDeck />
    </section>
  );
}
