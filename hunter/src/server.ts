import { initSchema } from "./lib/schema";

initSchema();
try {
  const { startEngine } = await import("./lib/engine");
  startEngine();
} catch (err) {
  console.error("[hunter] engine start failed", err);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const entry = await import("@tanstack/react-start/server-entry").then((m) => m.default ?? m);
    const response = await entry.fetch(request);
    response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';");
    return response;
  },
};
