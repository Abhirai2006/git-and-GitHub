import QuizRunner from "@/components/QuizRunner";

export default function QuizPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="text-sm font-semibold text-accent">Quiz</span>
      <h1 className="font-display text-3xl sm:text-4xl font-medium mt-2 mb-10">
        Test yourself before you get tested.
      </h1>
      <QuizRunner />
    </section>
  );
}
