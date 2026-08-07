import { initSchema } from "./lib/schema";
import { env } from "./lib/env";

initSchema();
try {
  const { startEngine } = await import("./lib/engine");
  startEngine();
} catch (err) {
  console.error("[hunter] engine start failed", err);
}

function isAuthorized(request: Request): boolean {
  if (!env.adminPassword) return true;
  const url = new URL(request.url);

  // Unsubscribe route must remain public for CAN-SPAM compliance
  if (url.pathname.startsWith("/unsubscribe")) return true;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  try {
    const credentials = Buffer.from(authHeader.split(" ")[1] ?? "", "base64").toString("utf-8");
    const [user, pass] = credentials.split(":");
    return pass === env.adminPassword || credentials === env.adminPassword;
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, envCtx: unknown, ctx: unknown) {
    if (!isAuthorized(request)) {
      return new Response("Unauthorized — ClientHunter Founder Access Only", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="ClientHunter Founder OS"',
          "Content-Type": "text/plain",
        },
      });
    }

    const entry = await import("@tanstack/react-start/server-entry").then((m) => m.default ?? m);
    const response = await entry.fetch(request);
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';",
    );
    return response;
  },
};
