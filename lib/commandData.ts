export type CommandEntry = {
  command: string;
  purpose: string;
  category: string;
};

export const commandReference: CommandEntry[] = [
  { category: "Setup", command: "git init", purpose: "Start tracking a new folder" },
  { category: "Setup", command: 'git config --global user.name "Name"', purpose: "Set your commit identity" },
  { category: "Setup", command: 'git config --global user.email "you@example.com"', purpose: "Set your commit email" },

  { category: "Basics", command: "git add <file>", purpose: "Stage a change" },
  { category: "Basics", command: 'git commit -m "message"', purpose: "Save a permanent snapshot" },
  { category: "Basics", command: "git status", purpose: "See what's changed and staged" },
  { category: "Basics", command: "git log", purpose: "View commit history" },

  { category: "Branching", command: "git branch <name>", purpose: "Create a branch" },
  { category: "Branching", command: "git checkout <name>", purpose: "Switch to a branch" },
  { category: "Branching", command: "git merge <name>", purpose: "Combine a branch into the current one" },
  { category: "Branching", command: "git stash", purpose: "Save unfinished work temporarily" },
  { category: "Branching", command: "git stash pop", purpose: "Restore the most recent stash" },

  { category: "Remote", command: "git clone <url>", purpose: "Copy a remote repository locally" },
  { category: "Remote", command: "git fetch origin", purpose: "Download remote changes without merging" },
  { category: "Remote", command: "git rebase origin/master", purpose: "Replay local commits on updated history" },
  { category: "Remote", command: "git merge <name> --no-ff -m \"msg\"", purpose: "Force a merge commit with a custom message" },

  { category: "Tags & Advanced", command: "git tag <name>", purpose: "Mark a commit as a release point" },
  { category: "Tags & Advanced", command: "git push origin <tag>", purpose: "Push a tag to the remote" },
  { category: "Tags & Advanced", command: "git cherry-pick <a>^..<b>", purpose: "Copy a range of commits onto the current branch" },

  { category: "History", command: "git show <commit>", purpose: "View one commit in full detail" },
  { category: "History", command: 'git log --author="name"', purpose: "Filter history by author" },
  { category: "History", command: 'git log --since="date" --until="date"', purpose: "Filter history by date range" },
  { category: "History", command: "git log -5 --oneline", purpose: "Show the last five commits, compactly" },
  { category: "History", command: "git revert <commit>", purpose: "Safely undo a commit" },
  { category: "History", command: "git reset --hard <commit>", purpose: "Rewrite history; use with caution" },
];
