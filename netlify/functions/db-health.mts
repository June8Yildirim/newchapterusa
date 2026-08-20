import { getClient, getDb } from "../lib/mongodb.mts";

/**
 * Lightweight MongoDB Atlas connectivity check.
 *
 *   GET /.netlify/functions/db-health
 *
 * Pings the cluster and reports whether the seeded content document exists.
 * Returns 200 when healthy, 503 when the database can't be reached or isn't
 * configured. Never exposes the connection string or credentials.
 */

const COLLECTION = "content";
const DOC_ID = "translations";

interface ContentDoc {
  _id: string;
  data?: Record<string, unknown>;
  updatedAt?: Date;
}

export default async (): Promise<Response> => {
  const startedAt = Date.now();
  try {
    const client = await getClient();
    await client.db().admin().command({ ping: 1 });

    const db = await getDb();
    const doc = await db
      .collection<ContentDoc>(COLLECTION)
      .findOne({ _id: DOC_ID }, { projection: { updatedAt: 1, data: 1 } });

    return Response.json(
      {
        ok: true,
        db: db.databaseName,
        latencyMs: Date.now() - startedAt,
        content: {
          seeded: !!doc,
          updatedAt: doc?.updatedAt ?? null,
          languages: doc?.data ? Object.keys(doc.data) : [],
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Database unreachable",
        latencyMs: Date.now() - startedAt,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
