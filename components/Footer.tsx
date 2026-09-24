import { GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-accent">
            <GitBranch size={12} strokeWidth={2.5} />
          </span>
          <span>viva.prep - BAIL308C, Project Management with Git</span>
        </div>
        <p>Built by Abhishek Rai for the Git &amp; GitHub lab course.</p>
      </div>
    </footer>
  );
}
