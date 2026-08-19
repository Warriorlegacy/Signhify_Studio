import { createMiddleware } from "@tanstack/react-start";
import { readByokSessionKeys } from "./byok-client";

/**
 * Function middleware that ships the browser-held BYOK client keys to the
 * server for the duration of a single request. The server side only forwards
 * them into the handler context — nothing is persisted.
 */
export const withByokKeys = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    return next({ sendContext: { byokClientKeys: readByokSessionKeys() } });
  })
  .server(async ({ next, context }) => {
    const byokClientKeys =
      (context as { byokClientKeys?: Record<string, string> }).byokClientKeys ?? {};
    return next({ context: { ...context, byokClientKeys } });
  });
