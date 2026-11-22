import QuizRunner from "@/components/QuizRunner";

export default function QuizPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="eyebrow">Quiz</span>
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mt-4 mb-10">
        Test yourself before you get tested.
      </h1>
      <QuizRunner />
    </section>
  );
}
