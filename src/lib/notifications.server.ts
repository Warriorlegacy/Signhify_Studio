import logger from "./logger";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

/** Inbox that receives every new sign-up / lead notification. */
export const NOTIFY_INBOX = "piyushrajsingh092@gmail.com";

/** Sender identity. Swap for a verified Resend domain once one is set up. */
const FROM = "Signhify <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends an email through the Resend connector gateway.
 * Never throws — notification failures must not break the user's submission.
 */
export async function sendEmail(opts: {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) {
    logger.error("[notifications] Email is not configured (missing gateway credentials).");
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(opts.to) ? opts.to : [opts.to ?? NOTIFY_INBOX],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      logger.error(`[notifications] Resend request failed [${res.status}]: ${body}`);
      return { sent: false, error: `resend_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    logger.error(`[notifications] Resend request threw: ${err}`);
    return { sent: false, error: "resend_exception" };
  }
}

/** Formats and delivers a new-lead notification to the studio inbox. */
export async function notifyNewLead(lead: {
  name: string;
  email: string;
  company?: string | null;
  type: string;
  scope: string;
  budget: string;
  timeline: string;
  goals: string[];
  message?: string | null;
  source: string;
}) {
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company || "—"],
    ["Type", lead.type],
    ["Plan / Scope", lead.scope],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
    ["Goals", lead.goals.join(", ") || "—"],
    ["Source", lead.source],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:#050810;padding:28px;color:#e8edf7">
      <h2 style="margin:0 0 6px;color:#4ade80">New Signhify sign-up</h2>
      <p style="margin:0 0 18px;color:#96a0b5;font-size:13px">${escapeHtml(lead.name)} just requested ${escapeHtml(lead.scope)}.</p>
      <table style="border-collapse:collapse;width:100%;font-size:13px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 10px;color:#8792a8;border-bottom:1px solid #1b2333;white-space:nowrap">${k}</td><td style="padding:6px 10px;border-bottom:1px solid #1b2333">${escapeHtml(String(v))}</td></tr>`,
          )
          .join("")}
      </table>
      ${
        lead.message
          ? `<div style="margin-top:18px;padding:14px;border-radius:12px;background:#0c1220;white-space:pre-wrap;font-size:13px">${escapeHtml(lead.message)}</div>`
          : ""
      }
    </div>`;

  return sendEmail({
    subject: `New ${lead.scope} sign-up — ${lead.name}`,
    html,
    replyTo: lead.email,
  });
}

/** Alerts the studio inbox when someone reports a manual (UPI / bank / PayPal) payment. */
export async function notifyManualPayment(payment: {
  email: string;
  amount: number;
  currency: string;
  method: string;
  description?: string | null;
  transactionRef: string;
}) {
  const rows: Array<[string, string]> = [
    ["From", payment.email],
    ["Amount", `${payment.currency} ${payment.amount}`],
    ["Method", payment.method],
    ["Plan / note", payment.description || "—"],
    ["Reference", payment.transactionRef],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:#050810;padding:28px;color:#e8edf7">
      <h2 style="margin:0 0 6px;color:#4ade80">Payment reported — confirm to activate</h2>
      <p style="margin:0 0 18px;color:#96a0b5;font-size:13px">Verify the transfer, then confirm the subscription.</p>
      <table style="border-collapse:collapse;width:100%;font-size:13px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 10px;color:#8792a8;border-bottom:1px solid #1b2333;white-space:nowrap">${k}</td><td style="padding:6px 10px;border-bottom:1px solid #1b2333">${escapeHtml(String(v))}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  return sendEmail({
    subject: `Payment reported — ${payment.currency} ${payment.amount} (${payment.method})`,
    html,
    replyTo: payment.email,
  });
}
