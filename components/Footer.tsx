import Link from "next/link";
import { GitBranch, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <GitBranch size={18} strokeWidth={1.8} className="text-accent" />
            viva.prep
          </div>
          <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
            BAIL308C, Project Management with Git. Mysore University School of Engineering, Department of AI &amp; ML.
          </p>
        </div>
        <nav className="text-sm space-y-2.5" aria-label="Footer">
          <p className="eyebrow mb-4">Practise</p>
          <Link className="block text-foreground/80 hover:text-accent" href="/present">Class slides</Link>
          <Link className="block text-foreground/80 hover:text-accent" href="/flashcards">Flashcards</Link>
          <Link className="block text-foreground/80 hover:text-accent" href="/quiz">Quiz</Link>
          <Link className="block text-foreground/80 hover:text-accent" href="/debug">Debug it</Link>
          <Link className="block text-foreground/80 hover:text-accent" href="/cheatsheet">Cheat sheet</Link>
        </nav>
        <div>
          <p className="eyebrow mb-4">Made by</p>
          <a href="https://portfolio-abhirai2006.lovable.app/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent">
            Abhishek Rai
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
