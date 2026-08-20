/**
 * Seed the site content (TRANSLATIONS) into MongoDB Atlas.
 *
 * Reads src/constants/translations.json and upserts it as a single document
 * in the `content` collection under _id "translations" — the exact shape the
 * /admin editor saves and the live site reads on boot.
 *
 * Run with env vars loaded from .env.local:
 *   node --env-file=.env.local scripts/seed-content.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_NAME = process.env.MONGODB_DB || "new_chapter_b2b";
const COLLECTION = "content";
const DOC_ID = "translations";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-content.mjs");
  process.exit(1);
}

const jsonPath = resolve(__dirname, "../src/constants/translations.json");
const data = JSON.parse(await readFile(jsonPath, "utf8"));

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
try {
  await client.connect();
  await client.db().admin().command({ ping: 1 });
  console.log("✓ Connected to Atlas");

  const col = client.db(DB_NAME).collection(COLLECTION);
  const res = await col.updateOne(
    { _id: DOC_ID },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true },
  );
  console.log(
    `✓ Seeded ${DB_NAME}.${COLLECTION}/${DOC_ID}`,
    res.upsertedCount ? "(created)" : "(updated)",
  );

  const check = await col.findOne({ _id: DOC_ID });
  console.log("✓ Read back languages:", Object.keys(check.data));
} finally {
  await client.close();
}
