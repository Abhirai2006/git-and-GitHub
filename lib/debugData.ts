export type DebugCase = {
  id: string;
  errorLines: { text: string; color?: string }[];
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

export const debugCases: DebugCase[] = [
  {
    id: "d1",
    errorLines: [
      { text: "$ git status" },
      { text: "fatal: not a git repository (or any of the parent directories): .git", color: "text-red-400" },
    ],
    prompt: "What's actually wrong here?",
    options: [
      { id: "a", text: "Git is not installed on this computer" },
      { id: "b", text: "You're not inside a folder that has been initialized as a repository" },
      { id: "c", text: "The internet connection is down" },
      { id: "d", text: "The repository has been deleted from GitHub" },
    ],
    correctId: "b",
    explanation: "This message means the current folder (or any parent folder) has no .git directory. cd into the correct project folder, or run git init if it genuinely hasn't been created yet.",
  },
  {
    id: "d2",
    errorLines: [
      { text: "$ git commit -m \"first commit\"" },
      { text: "*** Please tell me who you are.", color: "text-red-400" },
      { text: "Run" },
      { text: "  git config --global user.email \"you@example.com\"" },
      { text: "  git config --global user.name \"Your Name\"" },
    ],
    prompt: "What should you do?",
    options: [
      { id: "a", text: "Create a new GitHub account" },
      { id: "b", text: "Reinstall Git" },
      { id: "c", text: "Run the two git config commands Git is suggesting" },
      { id: "d", text: "Delete the repository and clone it again" },
    ],
    correctId: "c",
    explanation: "Git refuses to commit until it knows who to attribute the commit to. Running the two suggested git config --global commands, once per machine, fixes this permanently.",
  },
  {
    id: "d3",
    errorLines: [
      { text: "$ git merge origin/master" },
      { text: "fatal: refusing to merge unrelated histories", color: "text-red-400" },
    ],
    prompt: "What does this actually mean?",
    options: [
      { id: "a", text: "The remote repository has been deleted" },
      { id: "b", text: "Two histories with no shared starting commit are being merged" },
      { id: "c", text: "You have a typo in the branch name" },
      { id: "d", text: "Your Git version is outdated" },
    ],
    correctId: "b",
    explanation: "This happens when merging two repositories, or branches, that don't share a common commit in their history. It can be forced with --allow-unrelated-histories, but only after confirming that merging these two histories is actually what you want.",
  },
  {
    id: "d4",
    errorLines: [
      { text: "<<<<<<< HEAD", color: "text-accent-soft" },
      { text: "const greeting = \"Hello there\";" },
      { text: "=======", color: "text-accent-soft" },
      { text: "const greeting = \"Hi everyone\";" },
      { text: ">>>>>>> feature-branch", color: "text-accent-soft" },
    ],
    prompt: "You open a file and see this. What's the correct next step?",
    options: [
      { id: "a", text: "Delete the file and start over" },
      { id: "b", text: "Run git reset --hard immediately" },
      { id: "c", text: "Edit the file to keep the correct content, remove all three marker lines, then add and commit" },
      { id: "d", text: "Ignore it, Git will resolve it automatically on the next commit" },
    ],
    correctId: "c",
    explanation: "Those markers show a merge conflict: both branches changed the same line differently. Edit the section to keep whichever content (or a combination) is correct, delete the <<<<<<<, =======, and >>>>>>> lines, then stage and commit.",
  },
  {
    id: "d5",
    errorLines: [
      { text: "$ git checkout master" },
      { text: "error: Your local changes to the following files would be overwritten by checkout:", color: "text-red-400" },
      { text: "    notes.txt" },
      { text: "Please commit your changes or stash them before you switch branches." },
    ],
    prompt: "What's the fastest safe fix?",
    options: [
      { id: "a", text: "Force delete notes.txt" },
      { id: "b", text: "git stash, then switch branches, then git stash pop later" },
      { id: "c", text: "Reinstall Git" },
      { id: "d", text: "Rename the repository" },
    ],
    correctId: "b",
    explanation: "Git is protecting uncommitted work that conflicts with the target branch. Stashing sets it aside cleanly so you can switch branches, then pop it back whenever you're ready to continue.",
  },
  {
    id: "d6",
    errorLines: [
      { text: "$ git push" },
      { text: "fatal: The current branch feature-login has no upstream branch.", color: "text-red-400" },
      { text: "To push the current branch and set the remote as upstream, use" },
      { text: "    git push --set-upstream origin feature-login" },
    ],
    prompt: "What's happening, and what's the fix?",
    options: [
      { id: "a", text: "GitHub is down; wait and try again" },
      { id: "b", text: "The branch is corrupted and must be deleted" },
      { id: "c", text: "This is a brand new local branch GitHub doesn't know about yet; push it with -u once" },
      { id: "d", text: "You need admin permissions on the repository" },
    ],
    correctId: "c",
    explanation: "A newly created local branch has nothing to push to yet. Running git push -u origin <branch-name> once links it to a remote branch; every push after that can just be git push.",
  },
];
