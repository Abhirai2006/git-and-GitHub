// Builds the classroom decks.
//
// Source decks live in decks-src/*.html and are written like normal HTML, with
// each slide's speaker notes in an <aside class="notes"> block. This script
// removes those blocks and stores all notes together in one encoded block, so
// a student opening the deck (or its page source) does not see the notes as
// plain text. The deck engine decodes them only in teacher mode.
//
// This hides notes from casual view only. It is not security: anyone who
// knows the format can decode them.
//
// Runs automatically before `npm run build` (the "prebuild" script), and by
// hand with `npm run decks`. Output goes to public/decks/<name>.html.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "decks-src");
const outDir = join(root, "public", "decks");
mkdirSync(outDir, { recursive: true });

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " ", middot: "·", rarr: "→", larr: "←", mdash: "—", ndash: "–" };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, e) => (e in ENT ? ENT[e] : /^#\d+$/.test(e) ? String.fromCodePoint(+e.slice(1)) : m));
const clean = (html) =>
  decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .split("\n").map((l) => l.trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();

let count = 0;
for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".html"))) {
  let html = readFileSync(join(srcDir, file), "utf8");
  const notes = {};
  const starts = [];
  const re = /<section\b[^>]*\bclass="[^"]*\bslide\b[^"]*"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) starts.push(m.index);
  // walk the slides from the last one back, so earlier offsets stay valid
  for (let i = starts.length - 1; i >= 0; i--) {
    const a = starts[i], b = i + 1 < starts.length ? starts[i + 1] : html.length;
    let chunk = html.slice(a, b);
    const am = chunk.match(/<aside class="notes">([\s\S]*?)<\/aside>/);
    if (am) {
      notes[i] = clean(am[1]);
      chunk = chunk.replace(am[0], "");
      html = html.slice(0, a) + chunk + html.slice(b);
    }
  }
  const b64 = Buffer.from(JSON.stringify(notes), "utf8").toString("base64").split("").reverse().join("");
  const block = `<script type="text/plain" id="deck-notes">${b64}</script>\n`;
  if (!/<script src="engine\/deck\.js/.test(html)) throw new Error(`${file}: missing <script src="engine/deck.js">`);
  html = html.replace(/(<script src="engine\/deck\.js)/, block + "$1");
  html = html.replace(/^<!DOCTYPE html>/i, "<!DOCTYPE html>\n<!-- Generated from decks-src/" + file + " by scripts/build-decks.mjs. Edit the source file, not this one. -->");
  writeFileSync(join(outDir, file), html);
  count++;
  console.log(`decks: ${file}  ${starts.length} slides, ${Object.keys(notes).length} with notes`);
}
if (!count) console.log("decks: no source decks found in decks-src/");
