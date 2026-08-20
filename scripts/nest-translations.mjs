/**
 * One-off codemod: reshape the flat TRANSLATIONS into section-nested form.
 *
 * Reads the current flat data from src/constants/translations.json, groups each
 * top-level key under its section per SECTION_MAP, and writes:
 *   - src/constants/translations.json   (nested)
 *   - src/constants/text.ts             (nested, regenerated)
 *
 * `network` and `howWeWork` are already single self-contained objects, so they
 * ARE their own section (kept at the same path). Every other key is wrapped
 * under its section object.
 *
 * Exports SECTION_MAP, MERGE_SECTIONS, and keyToPath() so the component codemod
 * (nest-usages.mjs) shares the exact same mapping.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "../src/constants/translations.json");
const textPath = resolve(__dirname, "../src/constants/text.ts");

/** section -> keys that live under it. */
export const SECTION_MAP = {
  hero: ["meetCoach", "summary", "coachSubtitle", "credentialsRich", "applyCohort", "explorePillars"],
  research: ["publicationsTitle", "publicationsSubTitle", "publications", "publicationsLinkText", "publicationsRich", "watchSampleWebinar", "supportingDescription", "affiliationsTitle", "affiliationsSubtitle"],
  pillars: ["pillarsTitle", "pillarsSubtitle", "pillars"],
  network: ["network"],
  howWeWork: ["howWeWork"],
  discovery: ["nextSteps", "discoveryTitle", "discoveryDesc", "discoveryBtn", "discoveryModalTitle", "discoveryPlaceholderDate", "discoveryPlaceholderMessage", "discoverySubmitBtn", "discoverySuccessTitle", "discoverySuccessBody"],
  events: ["announcementsTitle", "announcementsSubTitle", "announcements", "happeningSoonTitle", "nextUpLabel", "reserveSpot", "upcomingEvents"],
  pastEvents: ["pastEventsTitle", "pastEventsSubTitle", "pastEventBadge", "pastEventRecap"],
  testimonials: ["testimonialsTitle", "janeDoe", "productManager", "latestUpdate"],
  application: ["submitApplicationTitle", "sendApplication", "submitApplicationBtn", "appReceived", "thanksApplying", "sending", "sendError", "close", "registrationBtn", "placeholderName", "placeholderEmail", "placeholderStage", "placeholderBarrier", "placeholderSupport", "mailSubject", "mailLabelName", "mailLabelEmail", "mailLabelStage", "mailLabelBarrier", "mailLabelSupport", "mailLabelConsent"],
  newsletter: ["submitNewsletterTitle", "newsletterIntro", "newsletterNameLabel", "newsletterEmailLabel", "newsletterEmailPlaceholder", "newsletterFocusLabel", "newsletterFocusPlaceholder", "newsletterFocusOptions", "newsletterSubmitBtn", "newsletterPrivacyNote", "newsletterSuccessTitle", "newsletterSuccessBody", "newsletterMailSubject"],
  navFooter: ["brand", "nav", "contactTitle", "contactSubtitle", "contactMessagePlaceholder", "contactSubmitBtn", "contactMailSubject", "contactSuccessTitle", "contactSuccessBody", "contactSendAnother", "footerDesc", "footerConnect", "footerCert", "footerEntity", "footerCopyright", "developedBy", "preFooter"],
  comingSoon: ["comingSoonTitle", "comingSoonSubtitle", "comingSoonDesc", "comingSoonBtn", "notifyModalTitle", "notifyPlaceholderEmail", "notifySubmitBtn", "notifySuccessTitle", "notifySuccessBody"],
};

/** Sections that ARE a single object key (kept at the same path, not wrapped). */
export const MERGE_SECTIONS = new Set(["network", "howWeWork"]);

/** key -> section lookup. */
export const KEY_TO_SECTION = {};
for (const [section, keys] of Object.entries(SECTION_MAP)) {
  for (const k of keys) KEY_TO_SECTION[k] = section;
}

/**
 * The access path a key maps to, as an array of segments.
 * Merge-section keys stay at their own name; others get [section, key].
 */
export function keyToPath(key) {
  const section = KEY_TO_SECTION[key];
  if (!section) return null;
  if (MERGE_SECTIONS.has(section)) return [key]; // e.g. network stays `network`
  return [section, key];
}

function nest(flatLang) {
  const out = {};
  for (const section of Object.keys(SECTION_MAP)) {
    if (MERGE_SECTIONS.has(section)) {
      // section == single object key; lift it directly.
      const [only] = SECTION_MAP[section];
      if (only in flatLang) out[section] = flatLang[only];
      continue;
    }
    const bucket = {};
    for (const key of SECTION_MAP[section]) {
      if (key in flatLang) bucket[key] = flatLang[key];
    }
    if (Object.keys(bucket).length) out[section] = bucket;
  }
  return out;
}

// ---- run (only when invoked directly, not when imported for the map) ----
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (!invokedDirectly) {
  // Imported for SECTION_MAP / keyToPath only; skip the file rewrite.
} else {
const flat = JSON.parse(await readFile(jsonPath, "utf8"));

// Validate the map covers exactly the keys present (union across langs).
const allKeys = new Set();
for (const lang of Object.keys(flat)) Object.keys(flat[lang]).forEach((k) => allKeys.add(k));
const mapped = new Set(Object.keys(KEY_TO_SECTION));
const unmapped = [...allKeys].filter((k) => !mapped.has(k));
const extra = [...mapped].filter((k) => !allKeys.has(k));
if (unmapped.length) throw new Error("Unmapped keys: " + unmapped.join(", "));
if (extra.length) console.warn("Mapped keys not present in data (ok):", extra.join(", "));

const nested = {};
for (const lang of Object.keys(flat)) nested[lang] = nest(flat[lang]);

await writeFile(jsonPath, JSON.stringify(nested, null, 2) + "\n");

const header = `export type Language = "en" | "tr";

/**
 * Merge content saved via the /admin editor (MongoDB Atlas, in production) over
 * the bundled defaults below. Called once at boot in src/main.tsx before render,
 * so every component that reads TRANSLATIONS[lang] picks up the saved copy.
 * Each language's keys are replaced wholesale, since the editor always saves the
 * complete object.
 */
export function applyStoredContent(stored: unknown): void {
  if (!stored || typeof stored !== "object") return;
  const source = stored as Record<string, Record<string, unknown>>;
  const target = TRANSLATIONS as unknown as Record<
    string,
    Record<string, unknown>
  >;
  for (const lang of Object.keys(source)) {
    const incoming = source[lang];
    if (!incoming || typeof incoming !== "object") continue;
    const dest = (target[lang] ??= {});
    for (const key of Object.keys(dest)) delete dest[key];
    Object.assign(dest, incoming);
  }
}

export const TRANSLATIONS = `;

await writeFile(textPath, header + JSON.stringify(nested, null, 2) + ";\n");

console.log("✓ Nested", Object.keys(flat).length, "languages into", Object.keys(SECTION_MAP).length, "sections");
for (const lang of Object.keys(nested)) {
  console.log(`  ${lang}: sections =`, Object.keys(nested[lang]).join(", "));
}
}
