import { db, now, json } from "./db.server";

export type EventType =
  | "lead_created"
  | "lead_verified"
  | "lead_qualified"
  | "lead_tier_changed"
  | "lead_unsubscribed"
  | "scout_run"
  | "scout_error"
  | "campaign_created"
  | "campaign_launched"
  | "message_written"
  | "message_sent"
  | "message_bounced"
  | "thread_created"
  | "reply_classified"
  | "reply_sent"
  | "lead_meeting"
  | "setting_changed";

export function event(type: EventType, payload: Record<string, unknown> = {}, leadId?: number): void {
  db.prepare(
    "INSERT INTO events (type, payload, lead_id, created_at) VALUES (?,?,?,?)",
  ).run(type, json(payload), leadId ?? null, now());
}

export function recentEvents(limit = 50): Array<{ id: number; type: string; payload: string; lead_id: number | null; created_at: string }> {
  return db
    .prepare("SELECT * FROM events ORDER BY id DESC LIMIT ?")
    .all(limit) as Array<{ id: number; type: string; payload: string; lead_id: number | null; created_at: string }>;
}
