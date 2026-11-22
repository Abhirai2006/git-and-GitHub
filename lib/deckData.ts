// The classroom presentations listed on /present.
// Each deck is a standalone page in public/decks/, built from decks-src/.
// To add a class: write decks-src/class-N.html, then add an entry here.

export type Deck = {
  slug: string;
  classNo: number;
  date: string; // shown as written
  title: string;
  blurb: string;
  experiments: string;
  topics: string[];
  slides: number;
  ready: boolean;
};

export const decks: Deck[] = [
  {
    slug: "class-1",
    classNo: 1,
    date: "Sat, 14 Nov 2026",
    title: "Your first steps on GitHub",
    blurb: "Account, repositories, README and Markdown, deleting files and repos, and public vs private.",
    experiments: "GitHub basics",
    topics: ["GitHub account", "New repository", "README.md", "Delete files", "Public ↔ private"],
    slides: 16,
    ready: true,
  },
  {
    slug: "class-2",
    classNo: 2,
    date: "Sat, 21 Nov 2026",
    title: "Git, on your own laptop",
    blurb: "Install Git, set your identity and run git init. Class 2 covered up to git init; the rest continues in Class 3.",
    experiments: "Experiments 1, 2, 3",
    topics: ["Install Git", "git config", "three areas", "git init"],
    slides: 32,
    ready: true,
  },
  {
    slug: "class-3",
    classNo: 3,
    date: "Sat, 28 Nov 2026",
    title: "Commit, branch, stash",
    blurb: "A quick recap, then the rest of Experiments 1 to 3: first commits, a branch and a merge, and stash.",
    experiments: "Experiments 1, 2, 3",
    topics: ["add · commit · log", "branch · merge", "practice branch", "stash · pop"],
    slides: 25,
    ready: true,
  },
  {
    slug: "class-4",
    classNo: 4,
    date: "Next class",
    title: "Your laptop meets GitHub",
    blurb: "Clone the repository from Class 1, fetch and rebase, and merge with a custom message.",
    experiments: "Experiments 4, 5, 6",
    topics: ["git clone", "git fetch", "git rebase", "merge --no-ff"],
    slides: 0,
    ready: false,
  },
];
