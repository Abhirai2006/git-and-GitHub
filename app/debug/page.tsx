import DebugRunner from "@/components/DebugRunner";

export default function DebugPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="eyebrow">Debug it</span>
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mt-4 mb-4">
        Real errors. What is actually wrong?
      </h1>
      <p className="text-muted mb-10 max-w-xl">
        Six error messages every Git beginner eventually sees. Read each one
        like you would in a real terminal, then pick the fix.
      </p>
      <DebugRunner />
    </section>
  );
}
