import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
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
