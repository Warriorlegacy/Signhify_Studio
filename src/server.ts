import "./lib/error-capture";
import logger from "./lib/logger";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Content Security Policy header
const CSP_HEADER =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.cloudflare.com https://ai.gateway.lovable.dev; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const error = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  logger.error("SSR Error", { error });

  // Also capture in Sentry if configured
  try {
    const { captureException } = await import("./lib/sentry.server");
    captureException(error, "SSR");
  } catch (sentryError) {
    logger.error("Failed to capture exception in Sentry", { error: sentryError });
  }

  const errorResponse = new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
  // Add CSP header to error response
  errorResponse.headers.set("Content-Security-Policy", CSP_HEADER);
  return errorResponse;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      // Add CSP header to normal response
      response.headers.set("Content-Security-Policy", CSP_HEADER);

      // Log request info
      logger.info("Request processed", {
        method: request.method,
        url: request.url,
        status: response.status,
      });

      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      logger.error("Server error", { error });

      // Also capture in Sentry if configured
      try {
        const { captureException } = await import("./lib/sentry.server");
        captureException(error, "Server");
      } catch (sentryError) {
        logger.error("Failed to capture exception in Sentry", { error: sentryError });
      }

      const errorResponse = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      // Add CSP header to error response
      errorResponse.headers.set("Content-Security-Policy", CSP_HEADER);
      return errorResponse;
    }
  },
};
