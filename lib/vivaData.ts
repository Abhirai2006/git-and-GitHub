export type VivaCard = {
  id: string;
  session: 1 | 2 | 3 | 4 | 5 | 0; // 0 = bonus
  question: string;
  answer: string;
};

export const sessionLabels: Record<number, string> = {
  0: "Bonus",
  1: "Session 1",
  2: "Session 2",
  3: "Session 3",
  4: "Session 4",
  5: "Session 5",
};

export const sessionTitles: Record<number, string> = {
  0: "Scenario Questions",
  1: "Getting Started",
  2: "Branching & Stashing",
  3: "Remote Repositories",
  4: "Tags & Advanced Ops",
  5: "History & Undoing",
};

export const vivaCards: VivaCard[] = [
  // Session 1
  { id: "s1-1", session: 1, question: "What is version control, and what problem does it solve?", answer: "Version control is a system that records changes to files over time so any earlier version can be recalled. It solves the problem of losing history when files are overwritten, and removes the need for manually renamed copies like final_v2." },
  { id: "s1-2", session: 1, question: "What is the difference between Git and GitHub?", answer: "Git is software installed locally that tracks changes and works fully offline. GitHub is a website that hosts Git repositories online and adds collaboration features such as issues and pull requests. Git can be used without GitHub." },
  { id: "s1-3", session: 1, question: "What does git init do?", answer: "It turns an ordinary folder into a Git repository by creating a hidden .git folder, which is where all history will be stored." },
  { id: "s1-4", session: 1, question: "What is the staging area, and why does it exist separately from the working directory?", answer: "The staging area is a holding place for changes that have been deliberately chosen for the next commit. It exists so a person can choose exactly which changes go into a snapshot, rather than every unsaved edit being committed automatically." },
  { id: "s1-5", session: 1, question: "What does the -m flag do in git commit?", answer: "It attaches a commit message directly on the command line, describing what changed and why, instead of opening a text editor to write one." },
  { id: "s1-6", session: 1, question: "Where does Git actually store a repository's history?", answer: "Inside the hidden .git folder at the root of the project, created by git init or git clone." },
  { id: "s1-7", session: 1, question: "Can Git be used without an internet connection? Why?", answer: "Yes. Git runs entirely on the local machine. An internet connection is only needed to interact with a remote repository, such as pushing to or pulling from GitHub." },
  { id: "s1-8", session: 1, question: "What does git config --global user.email actually control?", answer: "It sets the email address that gets permanently attached to every commit made on that machine, identifying who made each change." },
  { id: "s1-9", session: 1, question: "What happens if you run git commit without ever running git add?", answer: "Nothing new is committed for the unstaged changes. Git only commits what has been placed in the staging area; anything not staged is left out of the snapshot." },
  { id: "s1-10", session: 1, question: "Is 'master' the same as 'main'?", answer: "They refer to the same idea: the default primary branch of a repository. 'Master' was the traditional default name; 'main' is now commonly used instead. Neither name has any special technical behavior in Git itself." },

  // Session 2
  { id: "s2-1", session: 2, question: "Why do developers use branches instead of editing the master branch directly?", answer: "A branch is an isolated parallel copy of the project, so new or experimental work cannot break the working version. Changes are only brought into master once they are ready, using a merge." },
  { id: "s2-2", session: 2, question: "What is the difference between git branch and git checkout?", answer: "git branch creates a new branch without moving to it. git checkout switches the working directory to point at a different branch (or git switch, which does the same thing more explicitly)." },
  { id: "s2-3", session: 2, question: "What is a fast-forward merge?", answer: "A merge where the target branch has not moved since the source branch was created, so Git simply advances the pointer forward. No new commit is created." },
  { id: "s2-4", session: 2, question: "When does Git create a merge commit instead of a fast-forward?", answer: "When both branches have new commits since they diverged. Git combines both histories into a new commit that has two parent commits." },
  { id: "s2-5", session: 2, question: "What causes a merge conflict?", answer: "Both branches changed the exact same lines of a file in different ways, so Git cannot automatically decide which version is correct." },
  { id: "s2-6", session: 2, question: "How do you resolve a merge conflict?", answer: "Open the affected file, find the conflict markers, edit the content to keep the correct version, remove the marker lines, then stage and commit the file." },
  { id: "s2-7", session: 2, question: "What problem does git stash solve?", answer: "It lets you set aside uncommitted changes temporarily so you get a clean working directory, useful when you need to switch branches before your current work is ready to commit." },
  { id: "s2-8", session: 2, question: "What is the difference between git stash pop and git stash apply?", answer: "Both restore the most recently stashed changes. pop also removes that entry from the stash list afterward; apply keeps a copy in the stash." },
  { id: "s2-9", session: 2, question: "What would happen if you tried to switch branches with uncommitted changes that conflict with the target branch?", answer: "Git would refuse the checkout and warn that local changes would be overwritten, until those changes are committed, stashed, or discarded." },
  { id: "s2-10", session: 2, question: "Can you have more than one thing stashed at once?", answer: "Yes. Each git stash call adds a new entry to a list, viewable with git stash list, and any one of them can be applied by reference." },

  // Session 3
  { id: "s3-1", session: 3, question: "What is a 'remote' in Git?", answer: "A version of a repository hosted elsewhere, typically on GitHub, that can be pushed to and pulled from by anyone with access." },
  { id: "s3-2", session: 3, question: "What does 'origin' refer to by default?", answer: "The name Git automatically gives to the remote a repository was cloned from." },
  { id: "s3-3", session: 3, question: "What is the difference between git fetch and git pull?", answer: "git fetch downloads new commits from the remote without changing local branches. git pull does the same download and then immediately merges the changes into the current branch." },
  { id: "s3-4", session: 3, question: "Why is git fetch considered safe to run at any time?", answer: "Because it only downloads data; it never modifies the working directory or any local branch." },
  { id: "s3-5", session: 3, question: "What does git rebase do differently from a merge?", answer: "Rebase replays local commits on top of the updated branch, producing a linear history. A merge instead creates a new commit that joins both histories together, including any divergence." },
  { id: "s3-6", session: 3, question: "Why might a team prefer a linear history over one full of merge commits?", answer: "A linear history is easier to read and review, since commits appear in a single, ordered sequence rather than an interleaved graph of branches." },
  { id: "s3-7", session: 3, question: "What does the --no-ff flag do during a merge, and why use it deliberately?", answer: "It forces Git to create a merge commit even when a fast-forward would be possible, keeping a permanent, visible record that a feature branch was used." },
  { id: "s3-8", session: 3, question: "What does git clone actually download?", answer: "The complete project history, not just the latest snapshot of files, along with an automatically configured 'origin' remote pointing back to the source." },
  { id: "s3-9", session: 3, question: "What is a possible downside of rebasing commits that have already been pushed and shared with others?", answer: "Rebase rewrites commit history. If others have already pulled the original commits, rewriting them creates a mismatch that can cause confusing conflicts for everyone else." },
  { id: "s3-10", session: 3, question: "If a teammate pushes new commits to origin, how does your local repository find out?", answer: "It does not update automatically. Someone has to run git fetch (or git pull) to bring those new commits into the local repository." },

  // Session 4
  { id: "s4-1", session: 4, question: "What is a Git tag used for?", answer: "Marking a specific commit permanently, most often to label a release version such as v1.0." },
  { id: "s4-2", session: 4, question: "What is the difference between a lightweight tag and an annotated tag?", answer: "A lightweight tag is just a name pointing at a commit. An annotated tag also stores the tagger's name, date, and a message, and is recommended for actual releases." },
  { id: "s4-3", session: 4, question: "Does git tag push the tag to GitHub automatically?", answer: "No. Tags must be pushed explicitly, for example with git push origin v1.0." },
  { id: "s4-4", session: 4, question: "What does cherry-pick do differently from merge?", answer: "Cherry-pick copies one or more specific commits onto the current branch, rather than bringing in every commit from an entire branch." },
  { id: "s4-5", session: 4, question: "In the range syntax A^..B, what does the caret after A do?", answer: "It makes the range inclusive of commit A. Without the caret, only commits strictly after A would be included, and A itself would be silently skipped." },
  { id: "s4-6", session: 4, question: "Give a scenario where cherry-pick is more appropriate than a full merge.", answer: "Applying a single urgent bug fix from a feature branch onto a release branch, without pulling in the rest of that feature branch's unfinished work." },
  { id: "s4-7", session: 4, question: "What naming convention is commonly used for release tags?", answer: "Semantic versioning, such as v1.0.0, where the numbers typically represent major, minor, and patch level changes." },

  // Session 5
  { id: "s5-1", session: 5, question: "What information does git show display about a commit?", answer: "The author, the date, the full commit message, and the exact line-by-line changes introduced by that commit." },
  { id: "s5-2", session: 5, question: "How do you filter git log to see commits from one specific author?", answer: "Using the --author=\"name\" flag." },
  { id: "s5-3", session: 5, question: "How do you filter git log by a date range?", answer: "Using --since=\"date\" and --until=\"date\" together, which can also be combined with --author." },
  { id: "s5-4", session: 5, question: "What is the difference between git revert and git reset --hard?", answer: "git revert creates a new commit that undoes the changes of an earlier commit, keeping history intact. git reset --hard deletes commits after the target permanently, rewriting history." },
  { id: "s5-5", session: 5, question: "Why is git revert considered safer on shared branches?", answer: "Because nothing is deleted. The original commit stays visible in history, so other people's copies of the repository are never put out of sync." },
  { id: "s5-6", session: 5, question: "What happens to the original commit's content when you revert it?", answer: "It remains in the history exactly as it was. A new commit is added afterward that cancels out its changes." },
  { id: "s5-7", session: 5, question: "How would you view just the last three commits in a compact, one-line-per-commit format?", answer: "git log -3 --oneline" },
  { id: "s5-8", session: 5, question: "Why should git reset --hard be avoided on a commit that has already been pushed to a shared branch?", answer: "Because other collaborators may already have that commit locally. Deleting it on the shared branch creates a mismatch between histories that causes confusing errors when others try to push or pull." },

  // Bonus
  { id: "b-1", session: 0, question: "Two people clone the same repository. One of them commits and pushes. What does the other person need to do to see that update?", answer: "Run git fetch to download the new commits, then merge or rebase them into their own branch (or simply git pull, which does both steps at once)." },
  { id: "b-2", session: 0, question: "A student's terminal says 'fatal: not a git repository'. What is the first thing to check?", answer: "Whether the current folder is actually the project folder that was initialized with git init or cloned. Running pwd and ls will usually reveal the mistake." },
  { id: "b-3", session: 0, question: "Why should a project never commit its node_modules folder or an API key?", answer: "node_modules is regenerated automatically from a package file and only adds bulk to the repository. An API key committed to history remains recoverable by anyone with access even if deleted later, so it should be treated as compromised and rotated immediately." },
  { id: "b-4", session: 0, question: "If a commit message only says 'fix', what is wrong with that, technically?", answer: "Nothing prevents Git from accepting it, but it provides no information about what changed or why, making the history far less useful when reviewed later." },
];
