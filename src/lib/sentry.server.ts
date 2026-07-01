// Stub Sentry integration. Replace with real @sentry/node wiring when needed.
export function captureException(error: unknown, source?: string): void {
  console.error(`[sentry-stub]${source ? ` [${source}]` : ""}`, error);
}
