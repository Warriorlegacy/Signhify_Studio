import { db, now } from "./db.server";
import { env } from "./env";

export type JobKind =
  | "scout"
  | "verify"
  | "qualify"
  | "campaign_prepare"
  | "campaign_send"
  | "classify";

export type Job<T = unknown> = {
  id: number;
  kind: JobKind;
  payload: T;
  idempotency_key: string;
  status: "pending" | "running" | "done" | "failed";
  attempts: number;
  error: string | null;
  created_at: string;
  done_at: string | null;
};

export function enqueue<T>(kind: JobKind, payload: T, idempotencyKey: string): void {
  const existing = db
    .prepare("SELECT id FROM jobs WHERE idempotency_key = ? AND status IN ('pending','running','done')")
    .get(idempotencyKey);
  if (existing) return;
  db.prepare(
    "INSERT INTO jobs (kind, payload, idempotency_key, status, attempts, created_at) VALUES (?,?,?, 'pending', 0, ?)",
  ).run(kind, JSON.stringify(payload), idempotencyKey, now());
}

export function worker<T>(kind: JobKind, fn: (payload: T) => Promise<void> | void, { pollMs = 3000 } = {}) {
  let stop = false;
  const loop = async () => {
    while (!stop) {
      try {
        const job = db
          .prepare(
            "SELECT * FROM jobs WHERE kind = ? AND status = 'pending' ORDER BY id LIMIT 1",
          )
          .get(kind) as Job | undefined;
        if (job) {
          const payload = JSON.parse(String(job.payload)) as T;
          db.prepare("UPDATE jobs SET status = 'running', attempts = attempts + 1 WHERE id = ?").run(job.id);
          try {
            await fn(payload);
            db.prepare("UPDATE jobs SET status = 'done', done_at = ? WHERE id = ?").run(now(), job.id);
          } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            if (job.attempts >= 3) {
              db.prepare("UPDATE jobs SET status = 'failed', error = ? WHERE id = ?").run(error, job.id);
              console.error(`[worker:${kind}] failed permanently`, { jobId: job.id, error });
            } else {
              db.prepare("UPDATE jobs SET status = 'pending', error = ? WHERE id = ?").run(error, job.id);
            }
          }
        }
      } catch (err) {
        console.error(`[worker:${kind}] loop error`, err);
      }
      if (!stop) await new Promise((r) => setTimeout(r, pollMs));
    }
  };
  loop();
  return { stop: () => (stop = true), interval: null };
}

export function pendingJobs(): number {
  return (db.prepare("SELECT COUNT(*) c FROM jobs WHERE status = 'pending'").get() as { c: number }).c;
}

export function cronJob(name: string, intervalMs: number, fn: () => Promise<void> | void) {
  const tick = async () => {
    const last = db.prepare("SELECT value FROM settings WHERE key = ?").get(`cron:${name}`) as
      | { value: string }
      | undefined;
    const due = !last || Date.now() - Number(last.value) >= intervalMs;
    if (!due) return;
    db.prepare("INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
      `cron:${name}`,
      String(Date.now()),
    );
    try {
      await fn();
    } catch (err) {
      console.error(`[cron:${name}]`, err);
    }
  };
  setInterval(tick, Math.min(intervalMs, 60_000));
  tick();
  return { interval: null as unknown };
}
