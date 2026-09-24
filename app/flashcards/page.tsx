import FlashcardDeck from "@/components/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="text-sm font-semibold text-accent">Flashcards</span>
      <h1 className="font-display text-3xl sm:text-4xl font-medium mt-2 mb-10">
        Flip through every viva question.
      </h1>
      <FlashcardDeck />
    </section>
  );
}
