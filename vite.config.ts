import { defineConfig, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Dev-only endpoint used by the /admin content editor.
 * POST /__admin/save-content with the full TRANSLATIONS object as JSON,
 * and it rewrites src/constants/text.ts on disk. Never runs in production
 * (configureServer only executes for the dev server).
 */
function contentWriterPlugin(): Plugin {
  return {
    name: "content-writer",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__admin/save-content", (req, res, next) => {
        if (req.method !== "POST") return next();

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const target = fileURLToPath(
              new URL("./src/constants/text.ts", import.meta.url),
            );
            const contents =
              'export type Language = "en" | "tr";\n\n' +
              "export const TRANSLATIONS = " +
              JSON.stringify(data, null, 2) +
              ";\n";
            writeFileSync(target, contents, "utf8");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: String(err) }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    contentWriterPlugin(),
  ],
});
