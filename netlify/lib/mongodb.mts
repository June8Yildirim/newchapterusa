import { MongoClient, type Db } from "mongodb";

/**
 * Shared MongoDB Atlas connection helper for Netlify Functions.
 *
 * Netlify Functions run on serverless infrastructure: a "warm" instance may
 * handle many invocations, but new instances spin up cold. Opening a fresh
 * connection per invocation exhausts the Atlas connection pool, so we cache a
 * single MongoClient on `globalThis` and reuse it across warm invocations.
 *
 * Usage inside a function:
 *
 *   import { getDb } from "../lib/mongodb.mts";
 *
 *   export default async () => {
 *     const db = await getDb();
 *     const docs = await db.collection("items").find().toArray();
 *     return Response.json(docs);
 *   };
 *
 * Required environment variables (set in Netlify → Site settings → Environment
 * variables, and in .env.local for `netlify dev`):
 *
 *   MONGODB_URI  – full Atlas SRV connection string, e.g.
 *                  mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
 *   MONGODB_DB   – (optional) database name; falls back to the db in the URI,
 *                  then to "new_chapter_b2b".
 */

const DEFAULT_DB = "new_chapter_b2b";

// Reuse the connection across warm invocations of the same instance.
declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function clientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to the " +
        "Netlify environment variables (and .env.local for local `netlify dev`).",
    );
  }

  if (!globalThis.__mongoClientPromise) {
    const client = new MongoClient(uri, {
      // Keep the pool small — serverless instances are single-threaded and
      // Atlas free/shared tiers cap total connections.
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10_000,
    });
    globalThis.__mongoClientPromise = client.connect();
  }

  return globalThis.__mongoClientPromise;
}

/** Returns the shared, connected MongoClient. */
export async function getClient(): Promise<MongoClient> {
  return clientPromise();
}

/**
 * Returns a Db handle. Resolution order: explicit `dbName` argument,
 * then MONGODB_DB, then the default database name.
 */
export async function getDb(dbName?: string): Promise<Db> {
  const client = await clientPromise();
  return client.db(dbName ?? process.env.MONGODB_DB ?? DEFAULT_DB);
}
