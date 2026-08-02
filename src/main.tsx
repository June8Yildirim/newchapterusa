import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);

// Dev-only content editor at /admin. In production the branch is dead code
// (import.meta.env.DEV is statically false) so the editor is never bundled.
if (window.location.pathname.startsWith("/admin")) {
  import("./admin/AdminEditor").then(({ AdminEditor }) => {
    root.render(
      <StrictMode>
        <AdminEditor />
      </StrictMode>,
    );
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
