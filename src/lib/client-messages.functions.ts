import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "@/lib/admin";

export type ClientMessage = {
  id: string;
  client_id: string;
  project_id: string | null;
  listing_id: string | null;
  sender_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

const COLS = "id, client_id, project_id, listing_id, sender_role, body, read_at, created_at";

const emailOf = (context: any): string | null => (context?.claims as any)?.email ?? null;

/** Client (or the studio owner replying) posts a message. */
export const sendClientMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const body = String(o.body ?? "").trim();
    if (!body) throw new Error("Message cannot be empty.");
    if (body.length > 4000) throw new Error("Message is too long (4000 characters max).");
    return {
      body,
      projectId: typeof o.projectId === "string" && o.projectId ? o.projectId : null,
      listingId: typeof o.listingId === "string" && o.listingId ? o.listingId : null,
      clientId: typeof o.clientId === "string" && o.clientId ? o.clientId : null,
    };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const email = emailOf(context);
    const admin = isAdminEmail(email);
    const isStudioReply = admin && data.clientId && data.clientId !== userId;

    const row = {
      client_id: isStudioReply ? data.clientId : userId,
      project_id: data.projectId,
      listing_id: data.listingId,
      sender_role: isStudioReply ? "studio" : "client",
      body: data.body,
    };

    const { error } = await (supabase.from as any)("client_messages").insert(row);
    if (error) throw new Error(error.message);

    if (!isStudioReply) {
      try {
        const { sendEmail, NOTIFY_INBOX } = await import("./notifications.server");
        await sendEmail({
          to: NOTIFY_INBOX,
          subject: `New client message from ${email ?? userId}`,
          html: `<p><strong>${email ?? userId}</strong> sent a message about their blueprint:</p><blockquote>${data.body
            .replace(/</g, "&lt;")
            .replace(/\n/g, "<br/>")}</blockquote>`,
          ...(email ? { replyTo: email } : {}),
        });
      } catch {
        /* notification failures never block the message */
      }
    }

    return { ok: true as const };
  });

/** Every message in the signed-in client's own conversation. */
export const listMyClientMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await (supabase.from as any)("client_messages")
      .select(COLS)
      .eq("client_id", userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return { messages: (data ?? []) as ClientMessage[] };
  });

export type InboxThread = {
  clientId: string;
  clientLabel: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: ClientMessage[];
};

/** Studio owner inbox: every client conversation, newest first. */
export const listClientInbox = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    if (!isAdminEmail(emailOf(context))) throw new Error("Forbidden");

    const { data, error } = await (supabase.from as any)("client_messages")
      .select(COLS)
      .order("created_at", { ascending: true })
      .limit(1000);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as ClientMessage[];
    const byClient = new Map<string, ClientMessage[]>();
    for (const m of rows) {
      const list = byClient.get(m.client_id) ?? [];
      list.push(m);
      byClient.set(m.client_id, list);
    }

    // Resolve readable labels for each client.
    const labels = new Map<string, string>();
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await Promise.all(
        [...byClient.keys()].map(async (id) => {
          try {
            const { data: u } = await supabaseAdmin.auth.admin.getUserById(id);
            if (u?.user?.email) labels.set(id, u.user.email);
          } catch {
            /* fall back to the id */
          }
        }),
      );
    } catch {
      /* admin client unavailable — ids only */
    }

    const threads: InboxThread[] = [...byClient.entries()]
      .map(([clientId, messages]) => {
        const last = messages[messages.length - 1]!;
        return {
          clientId,
          clientLabel: labels.get(clientId) ?? `Client ${clientId.slice(0, 8)}`,
          lastMessage: last.body,
          lastAt: last.created_at,
          unread: messages.filter((m) => m.sender_role === "client" && !m.read_at).length,
          messages,
        };
      })
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));

    return { threads };
  });

/** Mark a client's incoming messages as read (studio owner only). */
export const markThreadRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const clientId = String((input as any)?.clientId ?? "");
    if (!clientId) throw new Error("Client ID required");
    return { clientId };
  })
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    if (!isAdminEmail(emailOf(context))) throw new Error("Forbidden");
    const { error } = await (supabase.from as any)("client_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("client_id", data.clientId)
      .eq("sender_role", "client")
      .is("read_at", null);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
