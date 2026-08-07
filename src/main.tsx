import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { applyStoredContent } from "./constants/text";

const root = createRoot(document.getElementById("root")!);

// In production, layer any content saved via the /admin editor (Netlify Blobs)
// over the bundled defaults before the first render. In dev we skip this and use
// src/constants/text.ts directly, which the Vite content-writer plugin rewrites
// on disk when you save (see vite.config.ts).
async function loadStoredContent() {
  if (import.meta.env.DEV) return;
  try {
    const res = await fetch("/.netlify/functions/content", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return;
    if (!res.headers.get("content-type")?.includes("application/json")) return;
    applyStoredContent(await res.json());
  } catch {
    // Network/parse failure -> fall back to the bundled defaults.
  }
}

async function boot() {
  await loadStoredContent();

  // Content editor at /admin (guarded by the AdminModal sign-in flow).
  if (window.location.pathname.startsWith("/admin")) {
    const { AdminEditor } = await import("./admin/AdminEditor");
    root.render(
      <StrictMode>
        <AdminEditor />
      </StrictMode>,
    );
  } else {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

boot();
