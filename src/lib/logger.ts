// logger.ts — server-only, lazily loaded so the SSR bundler externalizes pino
// Never import this file from client-side code.

type Logger = {
  info: (msg: string | object, ...args: unknown[]) => void;
  warn: (msg: string | object, ...args: unknown[]) => void;
  error: (msg: string | object, ...args: unknown[]) => void;
  debug: (msg: string | object, ...args: unknown[]) => void;
  child: (bindings: Record<string, unknown>) => Logger;
};

// Console fallback for environments where pino is unavailable (e.g. edge workers)
const consoleLogger: Logger = {
  info: (msg, ...args) => console.info("[info]", msg, ...args),
  warn: (msg, ...args) => console.warn("[warn]", msg, ...args),
  error: (msg, ...args) => console.error("[error]", msg, ...args),
  debug: (msg, ...args) => console.debug("[debug]", msg, ...args),
  child: () => consoleLogger,
};

let _logger: Logger = consoleLogger;
let _initialized = false;

async function initLogger(): Promise<Logger> {
  if (_initialized) return _logger;
  try {
    // Dynamic import — Rollup/Nitro will externalize pino at build time
    const pino = (await import(/* @vite-ignore */ "pino" as string)).default;
    const isDev = process.env.NODE_ENV !== "production";
    _logger = pino({
      level: isDev ? "debug" : "info",
      transport: isDev
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  } catch {
    // pino not available (edge runtime) — keep console fallback
    _logger = consoleLogger;
  }
  _initialized = true;
  return _logger;
}

// Synchronous proxy — uses cached logger after first async init
// On first call before init, falls back to console (acceptable for startup logs)
const handler: ProxyHandler<Logger> = {
  get(_target, prop: string) {
    const method = prop as keyof Logger;
    return (...args: unknown[]) => {
      const log = _logger[method] as (...a: unknown[]) => void;
      if (typeof log === "function") {
        log(...args);
      }
    };
  },
};

const logger = new Proxy(consoleLogger, handler) as Logger;

// Kick off async init immediately (fire-and-forget)
void initLogger();

export { initLogger };

// Create a child logger with context
export function createLogger(context: string): Logger {
  return _logger.child({ context });
}

export default logger;

export const info = (msg: string, context?: string) => {
  if (context) createLogger(context).info(msg);
  else logger.info(msg);
};

export const warn = (msg: string, context?: string) => {
  if (context) createLogger(context).warn(msg);
  else logger.warn(msg);
};

export const error = (msg: string, err?: Error, context?: string) => {
  if (context) {
    if (err) createLogger(context).error({ err }, msg);
    else createLogger(context).error(msg);
  } else {
    if (err) logger.error({ err }, msg);
    else logger.error(msg);
  }
};

export const debug = (msg: string, context?: string) => {
  if (context) createLogger(context).debug(msg);
  else logger.debug(msg);
};