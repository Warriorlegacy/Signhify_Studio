import "./lib/error-capture";
import logger from "./lib/logger";

// Patch global Request prototype to allow assigning custom properties (like 'ip' in Cloudflare/Nitro environment)
try {
  if (typeof globalThis.Request !== "undefined" && !("ip" in globalThis.Request.prototype)) {
    Object.defineProperty(globalThis.Request.prototype, "ip", {
      get() {
        return (this as any)._ip;
      },
      set(val) {
        (this as any)._ip = val;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  // Ignore
}

// Dynamically import and patch NodeRequest from srvx/node to allow setting 'ip' property locally
import("srvx/node")
  .then((srvx) => {
    const NodeRequest = srvx.NodeRequest;
    if (NodeRequest && NodeRequest.prototype) {
      const descriptor = Object.getOwnPropertyDescriptor(NodeRequest.prototype, "ip");
      if (descriptor && descriptor.get && !descriptor.set) {
        Object.defineProperty(NodeRequest.prototype, "ip", {
          get() {
            return (this as any)._ip !== undefined ? (this as any)._ip : descriptor.get!.call(this);
          },
          set(val) {
            (this as any)._ip = val;
          },
          configurable: true,
          enumerable: true,
        });
      }
    }
  })
  .catch(() => {
    // Ignore if srvx/node is not available
  });

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Content Security Policy header
const CSP_HEADER =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.cloudflare.com https://ai.gateway.lovable.dev https://fonts.googleapis.com https://fonts.gstatic.com https://calendly.com https://*.calendly.com; frame-src 'self' https://calendly.com https://*.calendly.com https://js.stripe.com https://*.stripe.com https://www.youtube.com https://player.vimeo.com https://www.loom.com; object-src 'none'; base-uri 'self'; form-action 'self';";

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
