import { GitBranch, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-accent">
            <GitBranch size={12} strokeWidth={2.5} />
          </span>
          <span>viva.prep - BAIL308C, Project Management with Git</span>
        </div>

        <a
          href="https://portfolio-abhirai2006.lovable.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-full border border-border pl-1.5 pr-4 py-1.5 hover:border-accent transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-[11px] font-display font-semibold">
            AR
          </span>
          <span className="text-foreground/80 group-hover:text-foreground transition-colors">
            Built by Abhishek Rai
          </span>
          <ArrowUpRight
            size={13}
            className="text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          />
        </a>
      </div>
    </footer>
  );
}
