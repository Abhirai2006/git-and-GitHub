import Link from "next/link";
import { GitBranch, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t-[2.5px] border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl">
            <span className="sticker flex h-9 w-9 items-center justify-center rounded-xl bg-pop-sun text-ink">
              <GitBranch size={17} strokeWidth={2.6} />
            </span>
            viva<span className="text-pop-pink">.</span>prep
          </div>
          <p className="mt-4 text-sm text-muted max-w-xs font-medium">
            BAIL308C, Project Management with Git. Mysore University School of Engineering, Dept. of AI &amp; ML.
          </p>
        </div>
        <div className="text-sm font-semibold space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-muted mb-3">Practise</div>
          <Link className="block hover:text-accent" href="/flashcards">Flashcards</Link>
          <Link className="block hover:text-accent" href="/quiz">Quiz</Link>
          <Link className="block hover:text-accent" href="/debug">Debug it</Link>
          <Link className="block hover:text-accent" href="/cheatsheet">Cheat sheet</Link>
          <Link className="block hover:text-accent" href="/present">Class slides</Link>
        </div>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-muted mb-3">Made by</div>
          <a
            href="https://portfolio-abhirai2006.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="pop-btn group inline-flex items-center gap-2.5 rounded-full bg-background pl-1.5 pr-4 py-1.5 text-sm font-bold"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-display">AR</span>
            Abhishek Rai
            <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </footer>
  );
}
