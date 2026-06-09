import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(async ({ command }) => {
  const isServe = command === "serve";
  const isBuild = command === "build";

  // PORT is only needed for the dev/preview server — not during `vite build`
  const rawPort = process.env.PORT;
  // Only enforce PORT during serve (dev/preview), never during build (Vercel, CI, etc.)
  if (isServe && !rawPort) {
    throw new Error(
      "PORT environment variable is required but was not provided.",
    );
  }
  const port = rawPort ? Number(rawPort) : 3000;
  if (isServe && rawPort && (Number.isNaN(port) || port <= 0)) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  // BASE_PATH defaults to "/" for Cloudflare Pages / standalone builds
  const basePath = process.env.BASE_PATH ?? "/";

  // Replit-only dev plugins — never include during production build
  const devOnlyPlugins = (!isServe || isBuild || process.env.REPL_ID === undefined)
    ? []
    : [
        await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
          m.default(),
        ),
        await import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        ),
        await import("@replit/vite-plugin-dev-banner").then((m) =>
          m.devBanner(),
        ),
      ];

  return {
    base: basePath,
    plugins: [react(), tailwindcss(), ...devOnlyPlugins],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: isServe
      ? {
          port,
          strictPort: true,
          host: "0.0.0.0",
          allowedHosts: true,
          fs: { strict: true },
        }
      : undefined,
    preview: isServe
      ? { port, host: "0.0.0.0", allowedHosts: true }
      : undefined,
  };
});
