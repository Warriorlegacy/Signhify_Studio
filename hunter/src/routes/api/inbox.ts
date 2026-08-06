import { createFileRoute } from "@tanstack/react-router";
import { db, rows, row, now } from "../../lib/db.server";
import { enqueue } from "../../lib/queue.server";
import { event } from "../../lib/events.server";
import type { Lead, Thread, Reply } from "../../agents/types";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const jsonBody = async (request: Request) => {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export const Route = createFileRoute("/api/inbox")({
  server: {
    handlers: {
      GET: async () => {
        const threads = rows(
          `SELECT t.*, l.org_name, l.contact_name, l.contact_email
           FROM threads t LEFT JOIN leads l ON l.id = t.lead_id
           ORDER BY t.updated_at DESC LIMIT 100`,
        );
        const unread = (row<{ c: number }>("SELECT COUNT(*) c FROM threads WHERE status = 'needs_reply'")?.c ?? 0);
        return json({ threads, unread });
      },
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        const action = body.action;
        if (action === "test-reply") {
          const leadId = Number(body.leadId);
          const text = String(body.text ?? "Interested — let's talk.");
          const lead = row<Lead>("SELECT * FROM leads WHERE id = ?", leadId);
          if (!lead) return json({ error: "lead not found" }, 404);
          const threadId = Number(
            db.prepare(
              "INSERT INTO threads (lead_id, subject, status, category, created_at, updated_at) VALUES (?,?, 'needs_reply', 'other', ?, ?)",
            ).run(leadId, `Re: ${lead.org_name}`, now(), now()).lastInsertRowid,
          );
          db.prepare(
            "INSERT INTO replies (thread_id, direction, body, status, created_at) VALUES (?, 'in', ?, 'received', ?)",
          ).run(threadId, text, now());
          event("thread_created", { threadId, leadId }, leadId);
          enqueue("classify", { threadId, body: text }, `classify:${threadId}`);
          return json({ ok: true, threadId });
        }
        if (action === "approve-reply") {
          const threadId = Number(body.threadId);
          const replyText = String(body.reply ?? "");
          const thread = row<Thread>("SELECT * FROM threads WHERE id = ?", threadId);
          if (!thread) return json({ error: "thread not found" }, 404);
          if (!replyText) return json({ error: "empty reply" }, 400);
          const messageId = Number(
            db.prepare(
              "INSERT INTO messages (lead_id, channel, direction, subject, body, status, created_at) VALUES (?, 'email', 'out', ?, ?, 'sent', ?)",
            ).run(thread.lead_id, thread.subject ?? "Re:", replyText, now()).lastInsertRowid,
          );
          db.prepare(
            "INSERT INTO replies (thread_id, direction, body, status, created_at) VALUES (?, 'out', ?, 'sent', ?)",
          ).run(threadId, replyText, now());
          db.prepare("UPDATE threads SET status = 'replied', updated_at = ? WHERE id = ?").run(now(), threadId);
          event("reply_sent", { threadId, messageId }, thread.lead_id ?? undefined);
          return json({ ok: true, messageId });
        }
        if (action === "book") {
          const threadId = Number(body.threadId);
          const thread = row<Thread>("SELECT * FROM threads WHERE id = ?", threadId);
          if (!thread) return json({ error: "thread not found" }, 404);
          db.prepare("UPDATE threads SET status = 'booked', updated_at = ? WHERE id = ?").run(now(), threadId);
          if (thread.lead_id) {
            db.prepare("UPDATE leads SET status = 'meeting', updated_at = ? WHERE id = ?").run(now(), thread.lead_id);
            event("lead_meeting", { threadId }, thread.lead_id);
          }
          return json({ ok: true, meetingUrl: "https://cal.com/signhify/intro" });
        }
        if (action === "regenerate") {
          const threadId = Number(body.threadId);
          const thread = row<Thread>("SELECT * FROM threads WHERE id = ?", threadId);
          if (!thread) return json({ error: "thread not found" }, 404);
          const lastIn = row<Reply>(
            "SELECT * FROM replies WHERE thread_id = ? AND direction = 'in' ORDER BY id DESC LIMIT 1",
            threadId,
          );
          enqueue("classify", { threadId, body: lastIn?.body ?? "" }, `classify:${threadId}:${Date.now()}`);
          return json({ ok: true });
        }
        return json({ error: "unknown action" }, 400);
      },
    },
  },
});
