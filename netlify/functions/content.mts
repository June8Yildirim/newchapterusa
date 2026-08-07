import { getStore } from "@netlify/blobs";

/**
 * Production content store for the /admin editor.
 *
 *   GET  /.netlify/functions/content  -> returns the saved TRANSLATIONS JSON,
 *                                        or `null` if nothing has been saved yet.
 *   POST /.netlify/functions/content  -> persists the full TRANSLATIONS object to
 *                                        Netlify Blobs. Requires the admin password
 *                                        in the `x-admin-password` header.
 *
 * The live site reads this on boot (see src/main.tsx) and layers it over the
 * bundled defaults in src/constants/text.ts. Netlify Blobs is configured
 * automatically on deployed sites — no extra env vars are needed for storage.
 */

const STORE = "site-content";
const KEY = "translations";

export default async (req: Request): Promise<Response> => {
  const store = getStore(STORE);

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "json" });
    return Response.json(data ?? null, {
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

    await store.setJSON(KEY, payload);
    return Response.json({ success: true });
  }

  return Response.json(
    { success: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET, POST" } },
  );
};
