import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { applyStoredContent } from "./constants/text";

const root = createRoot(document.getElementById("root")!);

// Layer any content saved via the /admin editor (MongoDB Atlas) over the bundled
// defaults before the first render. This runs in both dev and production: in dev
// the Vite content-api plugin serves /.netlify/functions/content from the same
// database (see vite.config.ts), so both environments behave identically.
async function loadStoredContent() {
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
