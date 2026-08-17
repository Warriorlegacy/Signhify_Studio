import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: { port: 3001, host: true },
    preview: { port: 3001, host: true },
    build: {
      rollupOptions: {
        external: ["bun:sqlite", "node:net", "node:dns/promises", "node:fs", "node:path", "node:url"],
      },
    },
    ssr: {
      external: ["bun:sqlite", "node:net", "node:dns/promises", "node:fs", "node:path", "node:url"],
    },
  },
});
