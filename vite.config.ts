import { defineConfig, loadEnv, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { MongoClient, type Db } from "mongodb";

/**
 * Dev-server bridge that makes `netlify dev`-style content storage work under a
 * plain `vite` dev server: it serves GET/POST /.netlify/functions/content from
 * MongoDB Atlas — the exact same contract as netlify/functions/content.mts.
 *
 * This makes development behave identically to production: the site hydrates its
 * TRANSLATIONS from the database on boot, and the /admin editor writes back to
 * the database. Requires MONGODB_URI (and optionally MONGODB_DB) in .env.local.
 */
function contentApiPlugin(env: Record<string, string>): Plugin {
  const COLLECTION = "content";
  const DOC_ID = "translations";
  const dbName = env.MONGODB_DB || "new_chapter_b2b";

  let dbPromise: Promise<Db> | null = null;
  const getDb = (): Promise<Db> => {
    if (!env.MONGODB_URI) {
      return Promise.reject(
        new Error("MONGODB_URI is not set in .env.local (server-side only)."),
      );
    }
    if (!dbPromise) {
      dbPromise = new MongoClient(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10_000,
      })
        .connect()
        .then((client) => client.db(dbName));
    }
    return dbPromise;
  };

  return {
    name: "content-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        "/.netlify/functions/content",
        (req, res, next) => {
          const json = (status: number, payload: unknown) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "no-store");
            res.end(JSON.stringify(payload));
          };

          if (req.method === "GET") {
            getDb()
              .then((db) =>
                db.collection(COLLECTION).findOne({ _id: DOC_ID as never }),
              )
              .then((doc) => json(200, (doc as { data?: unknown })?.data ?? null))
              .catch((err) => json(500, { success: false, error: String(err) }));
            return;
          }

          if (req.method === "POST") {
            const expected = env.VITE_ADMIN_PASSWORD;
            if (!expected) {
              return json(500, {
                success: false,
                error: "VITE_ADMIN_PASSWORD is not set in .env.local.",
              });
            }
            const provided = (req.headers["x-admin-password"] as string) ?? "";
            if (provided.trim() !== expected.trim()) {
              return json(401, { success: false, error: "Unauthorized" });
            }

            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              let payload: unknown;
              try {
                payload = JSON.parse(body);
              } catch {
                return json(400, {
                  success: false,
                  error: "Invalid JSON body",
                });
              }
              if (!payload || typeof payload !== "object") {
                return json(400, {
                  success: false,
                  error: "Expected a content object",
                });
              }
              getDb()
                .then((db) =>
                  db.collection(COLLECTION).updateOne(
                    { _id: DOC_ID as never },
                    { $set: { data: payload, updatedAt: new Date() } },
                    { upsert: true },
                  ),
                )
                .then(() => json(200, { success: true }))
                .catch((err) =>
                  json(500, { success: false, error: String(err) }),
                );
            });
            return;
          }

          next();
        },
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load every env var (including non-VITE_ server secrets like MONGODB_URI)
  // from .env / .env.local for use by the dev-only content API below.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      contentApiPlugin(env),
    ],
  };
});
