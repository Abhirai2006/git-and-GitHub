export type QuizQuestion = {
  id: string;
  session: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1", session: 1,
    prompt: "What is the main difference between Git and GitHub?",
    options: [
      { id: "a", text: "Git is older than GitHub, that's the only difference" },
      { id: "b", text: "Git is local software that tracks history; GitHub is a website that hosts it online" },
      { id: "c", text: "GitHub is required to use Git at all" },
      { id: "d", text: "They are just two names for the same tool" },
    ],
    correctId: "b",
    explanation: "Git runs entirely on your own machine and works offline. GitHub is a website for hosting and collaborating on Git repositories.",
  },
  {
    id: "q2", session: 1,
    prompt: "Which command turns an ordinary folder into a Git repository?",
    options: [
      { id: "a", text: "git start" },
      { id: "b", text: "git new" },
      { id: "c", text: "git init" },
      { id: "d", text: "git create" },
    ],
    correctId: "c",
    explanation: "git init creates the hidden .git folder that makes a folder a real repository.",
  },
  {
    id: "q3", session: 1,
    prompt: "What does the staging area actually do?",
    options: [
      { id: "a", text: "Permanently deletes old commits" },
      { id: "b", text: "Holds changes you've chosen for the next commit" },
      { id: "c", text: "Uploads your code to GitHub automatically" },
      { id: "d", text: "Nothing, it's optional and can be skipped" },
    ],
    correctId: "b",
    explanation: "The staging area lets you deliberately choose which changes go into the next commit, via git add.",
  },
  {
    id: "q4", session: 1,
    prompt: "What does the -m flag do in git commit -m \"message\"?",
    options: [
      { id: "a", text: "Opens a text editor for a longer message" },
      { id: "b", text: "Merges the current branch" },
      { id: "c", text: "Attaches the commit message directly on the command line" },
      { id: "d", text: "Marks the commit as a milestone" },
    ],
    correctId: "c",
    explanation: "-m lets you write the commit message inline, without opening an editor.",
  },
  {
    id: "q5", session: 2,
    prompt: "You see the word 'Fast-forward' after a merge. What does that mean?",
    options: [
      { id: "a", text: "A conflict occurred and was auto-resolved" },
      { id: "b", text: "The target branch hadn't moved, so Git just slid the pointer forward" },
      { id: "c", text: "Git skipped several commits to save time" },
      { id: "d", text: "The merge failed" },
    ],
    correctId: "b",
    explanation: "A fast-forward merge happens when the branch being merged into has no new commits, so Git simply moves the pointer, with no merge commit needed.",
  },
  {
    id: "q6", session: 2,
    prompt: "What problem does git stash solve?",
    options: [
      { id: "a", text: "It permanently saves finished work" },
      { id: "b", text: "It temporarily sets aside unfinished changes so you can switch branches cleanly" },
      { id: "c", text: "It deletes uncommitted changes" },
      { id: "d", text: "It uploads your branch to GitHub" },
    ],
    correctId: "b",
    explanation: "git stash saves uncommitted work aside and gives you a clean working directory, useful when you need to switch context quickly.",
  },
  {
    id: "q7", session: 2,
    prompt: "What typically causes a merge conflict?",
    options: [
      { id: "a", text: "Two branches changing the exact same lines differently" },
      { id: "b", text: "Running git init twice" },
      { id: "c", text: "Forgetting to commit before lunch" },
      { id: "d", text: "Cloning a repository" },
    ],
    correctId: "a",
    explanation: "Git can merge non-overlapping changes automatically. Conflicts only arise when the same lines were edited differently on both sides.",
  },
  {
    id: "q8", session: 2,
    prompt: "Which command lists every branch, marking the current one with an asterisk?",
    options: [
      { id: "a", text: "git log" },
      { id: "b", text: "git status" },
      { id: "c", text: "git branch" },
      { id: "d", text: "git show" },
    ],
    correctId: "c",
    explanation: "Running git branch with no arguments lists all local branches and marks your current one.",
  },
  {
    id: "q9", session: 3,
    prompt: "What does 'origin' refer to, by default?",
    options: [
      { id: "a", text: "The very first commit ever made" },
      { id: "b", text: "The name of your main branch" },
      { id: "c", text: "The remote repository a project was cloned from" },
      { id: "d", text: "A required GitHub username" },
    ],
    correctId: "c",
    explanation: "origin is simply the default name Git assigns to the remote a repository was cloned from.",
  },
  {
    id: "q10", session: 3,
    prompt: "Why is git fetch considered always safe to run?",
    options: [
      { id: "a", text: "It never touches your files or branches, it only downloads data" },
      { id: "b", text: "It automatically fixes merge conflicts" },
      { id: "c", text: "It deletes old branches for you" },
      { id: "d", text: "It only works when there's nothing to update" },
    ],
    correctId: "a",
    explanation: "git fetch downloads new commits without merging or changing anything in your working directory, unlike git pull.",
  },
  {
    id: "q11", session: 3,
    prompt: "What's the key difference between git pull and git fetch?",
    options: [
      { id: "a", text: "pull also merges automatically; fetch only downloads" },
      { id: "b", text: "They are completely identical commands" },
      { id: "c", text: "fetch deletes remote branches" },
      { id: "d", text: "pull only works without an internet connection" },
    ],
    correctId: "a",
    explanation: "git pull runs a fetch and then immediately merges the new commits into your current branch.",
  },
  {
    id: "q12", session: 3,
    prompt: "What does --no-ff force during a merge?",
    options: [
      { id: "a", text: "A fast-forward, always" },
      { id: "b", text: "A merge commit even when a fast-forward is possible" },
      { id: "c", text: "Deletion of the merged branch" },
      { id: "d", text: "A rebase instead of a merge" },
    ],
    correctId: "b",
    explanation: "--no-ff keeps a permanent, visible record that a feature branch existed, rather than silently fast-forwarding.",
  },
  {
    id: "q13", session: 4,
    prompt: "In git cherry-pick A^..B, what does the caret after A do?",
    options: [
      { id: "a", text: "Nothing, it's optional styling" },
      { id: "b", text: "Makes the range inclusive of commit A" },
      { id: "c", text: "Reverses the direction of the range" },
      { id: "d", text: "Deletes commit A" },
    ],
    correctId: "b",
    explanation: "Without the caret, Git would only include commits strictly after A, silently skipping A itself.",
  },
  {
    id: "q14", session: 4,
    prompt: "What's the difference between a lightweight tag and an annotated tag?",
    options: [
      { id: "a", text: "Lightweight stores a tagger name, date, and message; annotated does not" },
      { id: "b", text: "Annotated stores a tagger name, date, and message; lightweight is just a pointer" },
      { id: "c", text: "They behave identically in every way" },
      { id: "d", text: "Lightweight tags cannot be pushed to GitHub" },
    ],
    correctId: "b",
    explanation: "Annotated tags carry extra metadata and are recommended for real releases; lightweight tags are just a name on a commit.",
  },
  {
    id: "q15", session: 4,
    prompt: "What does git cherry-pick fundamentally do?",
    options: [
      { id: "a", text: "Merges two branches entirely" },
      { id: "b", text: "Copies specific commits onto the current branch" },
      { id: "c", text: "Permanently deletes a commit" },
      { id: "d", text: "Renames a branch" },
    ],
    correctId: "b",
    explanation: "Cherry-pick takes one or more chosen commits from elsewhere and replays them on your current branch.",
  },
  {
    id: "q16", session: 4,
    prompt: "Are tags pushed to GitHub automatically when you create them?",
    options: [
      { id: "a", text: "Yes, always, immediately" },
      { id: "b", text: "No, they must be pushed explicitly" },
      { id: "c", text: "Only annotated tags push automatically" },
      { id: "d", text: "Only if the repository is public" },
    ],
    correctId: "b",
    explanation: "A tag stays local until you explicitly run something like git push origin v1.0.",
  },
  {
    id: "q17", session: 5,
    prompt: "Which command undoes a commit WITHOUT deleting it from history?",
    options: [
      { id: "a", text: "git reset --hard" },
      { id: "b", text: "git revert" },
      { id: "c", text: "git delete" },
      { id: "d", text: "git undo" },
    ],
    correctId: "b",
    explanation: "git revert creates a new commit that cancels out an earlier one, so nothing is ever deleted from history.",
  },
  {
    id: "q18", session: 5,
    prompt: "Why should you avoid git reset --hard on a branch other people already pulled?",
    options: [
      { id: "a", text: "It's slower than other commands" },
      { id: "b", text: "It only works on Windows" },
      { id: "c", text: "It permanently deletes commits others may still have locally, causing mismatched history" },
      { id: "d", text: "It requires a GitHub Pro account" },
    ],
    correctId: "c",
    explanation: "reset --hard rewrites history by deleting commits. If others already have those commits, this creates confusing mismatches when syncing.",
  },
  {
    id: "q19", session: 5,
    prompt: "Which flags together filter commits by a specific author within a date range?",
    options: [
      { id: "a", text: "--author and --since / --until" },
      { id: "b", text: "--grep and --since only" },
      { id: "c", text: "--branch and --author" },
      { id: "d", text: "--tag and --date" },
    ],
    correctId: "a",
    explanation: "git log --author=\"name\" --since=\"date\" --until=\"date\" narrows history to exactly that person and period.",
  },
  {
    id: "q20", session: 5,
    prompt: "What does git show <commit> display?",
    options: [
      { id: "a", text: "Only the commit message" },
      { id: "b", text: "Author, date, message, and the full diff" },
      { id: "c", text: "Just a list of changed file names" },
      { id: "d", text: "The branch name only" },
    ],
    correctId: "b",
    explanation: "git show gives the complete picture of one commit: who, when, why, and exactly what changed line by line.",
  },
];
