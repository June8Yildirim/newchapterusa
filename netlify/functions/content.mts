import { getDb } from "../lib/mongodb.mts";

/**
 * Production content store for the /admin editor, backed by MongoDB Atlas.
 *
 *   GET  /.netlify/functions/content  -> returns the saved TRANSLATIONS JSON,
 *                                        or `null` if nothing has been saved yet.
 *   POST /.netlify/functions/content  -> persists the full TRANSLATIONS object.
 *                                        Requires the admin password in the
 *                                        `x-admin-password` header.
 *
 * The live site reads this on boot (see src/main.tsx) and layers it over the
 * bundled defaults in src/constants/text.ts. Storage lives in the `content`
 * collection under _id "translations"; set MONGODB_URI (and optionally
 * MONGODB_DB) in the Netlify environment. Seed initial data with
 * `node --env-file=.env.local scripts/seed-content.mjs`.
 */

const COLLECTION = "content";
const DOC_ID = "translations";

interface ContentDoc {
  _id: string;
  data: unknown;
  updatedAt: Date;
}

export default async (req: Request): Promise<Response> => {
  let collection;
  try {
    const db = await getDb();
    collection = db.collection<ContentDoc>(COLLECTION);
  } catch (err) {
    return Response.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Database connection failed",
      },
      { status: 500 },
    );
  }

  if (req.method === "GET") {
    const doc = await collection.findOne({ _id: DOC_ID });
    return Response.json(doc?.data ?? null, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    const expected = process.env.VITE_ADMIN_PASSWORD;
    if (!expected) {
      return Response.json(
        {
          success: false,
          error:
            "Server not configured: set the ADMIN_PASSWORD environment variable in Netlify (must match VITE_ADMIN_PASSWORD), then redeploy.",
        },
        { status: 500 },
      );
    }
    const provided = req.headers.get("x-admin-password") ?? "";
    if (provided.trim() !== expected.trim()) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (!payload || typeof payload !== "object") {
      return Response.json(
        { success: false, error: "Expected a content object" },
        { status: 400 },
      );
    }

    await collection.updateOne(
      { _id: DOC_ID },
      { $set: { data: payload, updatedAt: new Date() } },
      { upsert: true },
    );
    return Response.json({ success: true });
  }

  return Response.json(
    { success: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET, POST" } },
  );
};
