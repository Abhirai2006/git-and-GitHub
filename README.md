# viva.prep

A Git and GitHub viva preparation site for BAIL308C, Project Management with Git.
Flashcards, a quiz, and a searchable command reference, covering all five sessions
and twelve lab experiments.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.
No backend, no database, no sign-up. All progress (starred cards, quiz best score)
is stored in the visitor's own browser via localStorage.

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy to Netlify

This project is already configured for a static export (see `next.config.ts`
and `netlify.toml`), so Netlify needs no extra setup.

**Option A: drag and drop**
1. Run `npm install` then `npm run build`.
2. An `out/` folder will be created.
3. Go to app.netlify.com, choose "Add new site" -> "Deploy manually", and drag
   the `out` folder in.

**Option B: connect a Git repository (recommended, gives you automatic redeploys)**
1. Push this folder to a new GitHub repository.
2. On Netlify, choose "Add new site" -> "Import an existing project" and pick
   the repository.
3. Build command: `npm run build`. Publish directory: `out`. Netlify will
   pick these up automatically from `netlify.toml`.
4. Deploy. Every future push to the repository redeploys the site.

## Editing the content

- `lib/vivaData.ts` - all flashcard question and answer pairs
- `lib/quizData.ts` - all quiz questions, options, and explanations
- `lib/commandData.ts` - the cheat sheet command reference

Add, remove, or edit entries in these three files and the site updates
everywhere it's used (stats counters, filters, and all).
