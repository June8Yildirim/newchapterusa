/**
 * One-off codemod: rewrite component reads of TRANSLATIONS to the nested paths.
 *
 * For every src file it finds the alias(es) bound to TRANSLATIONS[lang]
 * (`const t = TRANSLATIONS[lang]`, etc.) and rewrites `<alias>.<key>` and any
 * inline `TRANSLATIONS[lang].<key>` to the section-nested path from
 * nest-translations.mjs. Keys in MERGE_SECTIONS (network/howWeWork) are left
 * untouched since their path is unchanged.
 *
 * Skips constants/text.ts (already regenerated) and admin/AdminEditor.tsx (it
 * walks the whole tree, handled separately). TypeScript is the safety net for
 * anything this misses.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { SECTION_MAP, MERGE_SECTIONS, keyToPath } from "./nest-translations.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "../src");
const SKIP = new Set(["constants/text.ts", "admin/AdminEditor.tsx"]);

// Wrapped keys only (those whose path is [section, key]); sorted longest-first.
const wrappedKeys = Object.values(SECTION_MAP)
  .flat()
  .filter((k) => !MERGE_SECTIONS.has(keyToPath(k)?.[0] ?? "") && keyToPath(k).length === 2)
  .sort((a, b) => b.length - a.length);

const alt = wrappedKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

function pathFor(key) {
  return keyToPath(key).join(".");
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield p;
  }
}

let changedFiles = 0;
let changedSites = 0;

for await (const file of walk(SRC)) {
  const rel = file.slice(SRC.length + 1);
  if (SKIP.has(rel)) continue;

  let text = await readFile(file, "utf8");
  const before = text;

  // Aliases bound to TRANSLATIONS[lang] in this file.
  const aliases = new Set();
  for (const m of text.matchAll(/const\s+(\w+)\s*=\s*TRANSLATIONS\[lang\]/g)) {
    aliases.add(m[1]);
  }

  const prefixes = [...aliases, "TRANSLATIONS\\[lang\\]"];
  for (const prefix of prefixes) {
    const re = new RegExp(`(?<![\\w.])(${prefix})\\.(${alt})(?![\\w])`, "g");
    text = text.replace(re, (_m, p, key) => {
      changedSites++;
      return `${p}.${pathFor(key)}`;
    });
  }

  if (text !== before) {
    await writeFile(file, text);
    changedFiles++;
    console.log("updated", rel);
  }
}

console.log(`\n✓ Rewrote ${changedSites} access site(s) across ${changedFiles} file(s)`);
