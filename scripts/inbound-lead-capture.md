# Signhify AI Studio — Inbound Lead Capture System

> A complete system for capturing, qualifying, and acting on inbound leads from the website.
> The contact form already exists at `/contact`. This doc adds the auto-responder, qualification, and CRM tracking.

---

## Architecture

```
                    ┌─────────────────┐
                    │  Website Forms   │
                    │  /contact        │
                    │  /ai-mvp-builder │
                    │  /free-consult   │
                    └────────┬────────┘
                             │ POST (JSON)
                             ▼
                    ┌─────────────────┐
                    │  Submit Lead    │  ← createServerFn (leads.functions.ts)
                    │  Server Fn      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌──────────────┐
      │  Supabase    │ │  Auto-   │ │  Local       │
      │  leads table │ │ responder │ │  Fallback    │
      └──────────────┘ └──────────┘ │  (localStorage│
                                    │  if server   │
                                    │  unreachable)│
                                    └──────────────┘
```

---

## 1. Lead Capture Endpoint

The existing server function at `src/lib/leads.functions.ts` already handles this:

```typescript
// src/lib/leads.functions.ts — already exists, no changes needed
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: Lead) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      type: data.type,
      scope: data.scope,
      budget: data.budget,
      timeline: data.timeline,
      goals: data.goals,
      message: data.message || null,
      source: "studio-wizard",  // override per-form
    });
    return { ok: true as const };
  });
```

### What's needed: multi-source tracking

When called from different pages, override the `source` field:

| Page | Source value |
|------|-------------|
| `/contact` | `studio-wizard` |
| `/ai-mvp-builder` | `ai-mvp-campaign` |
| `/free-consultation` | `free-consult` |
| `/sprint` | `sprint-page` |

### Implementation — pass source from the client

In each form's submit handler:

```typescript
await submitLead({ data: { ...result.data, source: "ai-mvp-campaign" } });
```

(Then tweak the server function to accept the source override — or keep it hardcoded per route. The latter is simpler and avoids schema changes.)

---

## 2. Auto-Responder Email

When a lead submits successfully, the server function should trigger an auto-responder.

### Option A: Supabase Edge Function (recommended — async, no blocking)

Create `supabase/functions/lead-auto-responder/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

serve(async (req) => {
  const { email, name, source } = await req.json();
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_KEY) return new Response("no key", { status: 500 });

  const subject = source === "ai-mvp-campaign"
    ? "Your AI MVP builder blueprint is ready"
    : "Thanks for reaching out to Signhify";

  const text = `Hi ${name},

Thanks for reaching out to Signhify AI Studio.

Here's what happens next:
1. Piyush (founder) reviews your submission personally
2. Within 24 hours, you'll get a reply with scope, architecture recommendations, and fixed pricing if there's a fit
3. If there's a fit, we'll book a 30-minute blueprint call

In the meantime:
→ Try the free AI blueprint generator: https://signhify.dpdns.org/ai
→ Browse open-source code: https://github.com/Warriorlegacy/Signhify_Studio
→ See transparent pricing: https://signhify.dpdns.org/pricing

If urgency: reply directly or WhatsApp +91-6202442690

— Piyush Raj Singh
Founder & Lead AI Engineer, Signhify AI Studio
`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Piyush <piyush@signhify.dpdns.org>",
      to: email,
      subject,
      text,
    }),
  });

  return new Response(await res.text(), { status: res.status });
});
```

Trigger via Supabase `INSERT` hook or call directly from the server function:

```typescript
// In leads.functions.ts handler, after supabase insert:
try {
  await fetch("https://[PROJECT_REF].functions.supabase.co/lead-auto-responder", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
    body: JSON.stringify({ email: data.email, name: data.name, source: data.source }),
  });
} catch { /* non-blocking */ }
```

### Option B: Resend API directly from the server function

Simpler — no Edge Function needed:

```typescript
// After supabase insert succeeds:
try {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (RESEND_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Piyush <piyush@signhify.dpdns.org>",
        to: data.email,
        subject: data.source === "ai-mvp-campaign"
          ? "Your AI MVP Builder blueprint is ready"
          : "Thanks for reaching out to Signhify",
        text: `...`,
      }),
    });
  }
} catch { /* non-blocking — lead is already saved */ }
```

---

## 3. Lead Qualification (Automatic)

Run these rules when a lead arrives:

### Hot lead
All of:
- Budget: `$2,000+` or `$500-$2,000` + clear scope
- Timeline: `This week` or `2-4 weeks`
- Scope: `Brand-new build` or `MVP / first version`
- Message: ≥ 30 characters (they wrote something specific)

→ **Action**: Send "hot lead" notification. Piyush calls within 1 hour.
→ **Email template**: "Quick turnaround" variant — personal, fast, direct.

### Warm lead
Any of:
- Budget: `$500-$2,000` or `$2,000-$5,000`
- Timeline: `2-4 weeks` or `1-3 months`
- Goals ≥ 3 selected
- Company name provided

→ **Action**: Send case studies and pricing. Standard 24h response.
→ **Email template**: Studio/Sprint overview + link to blueprint generator.

### Cold lead
None of the above — `Just exploring`, no budget, no timeline.

→ **Action**: Nurture with newsletter. No immediate call.
→ **Email template**: "Welcome to Signhify" — invite to try the free AI blueprint generator. Add to monthly newsletter list.

---

## 4. Slack Notification (If Configured)

Simple webhook. Add to the server function after insert:

```typescript
if (process.env.SLACK_WEBHOOK_URL) {
  const blocks = [
    { type: "header", text: { type: "plain_text", text: `📥 New lead: ${data.name}` } },
    { type: "section", fields: [
      { type: "mrkdwn", text: `*Company:* ${data.company || "—"}` },
      { type: "mrkdwn", text: `*Email:* ${data.email}` },
      { type: "mrkdwn", text: `*Budget:* ${data.budget}` },
      { type: "mrkdwn", text: `*Timeline:* ${data.timeline}` },
      { type: "mrkdwn", text: `*Type:* ${data.type}` },
      { type: "mrkdwn", text: `*Source:* ${data.source || "website"}` },
    ]},
  ];
  if (data.message) blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Message:* ${data.message}` } });
  blocks.push({
    type: "actions",
    elements: [{ type: "button", text: { type: "plain_text", text: "Contact lead" }, url: `mailto:${data.email}` }],
  });

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ blocks }),
  });
}
```

### Slack message example:

```
┌────────────────────────────────────────────┐
│ 📥 New lead: Sarah Chen                   │
│                                            │
│ Company: AITools Inc.                     │
│ Email: sarah@aitools.io                   │
│ Budget: $2,000 – $5,000                   │
│ Timeline: 2–4 weeks                        │
│ Type: SaaS / Product                       │
│ Source: ai-mvp-campaign                    │
│ Message: "Need AI analytics dashboard..."  │
│                                            │
│ [Contact lead]                             │
└────────────────────────────────────────────┘
```

---

## 5. CRM Spreadsheet (Google Sheets)

Append every lead to a Google Sheet for backup and manual review.

### Option A: Zapier (no code)

1. Create a Zap: "New row in Supabase leads table → Add row to Google Sheet"
2. Supabase trigger: Webhook on `INSERT` to `leads` table
3. Google Sheet: columns match the leads schema

### Option B: Direct Google Sheets API

Add to the server function:

```typescript
if (process.env.GOOGLE_SHEETS_WEBHOOK) {
  await fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
    method: "POST",
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      company: data.company,
      type: data.type,
      scope: data.scope,
      budget: data.budget,
      timeline: data.timeline,
      goals: data.goals.join(", "),
      message: data.message,
      source: data.source || "website",
    }),
  });
}
```

Pipedream or Make.com webhook can receive this and append to Sheets.

---

## 6. Local Fallback (When Supabase Is Down)

The contact page already implements this (see `contact.tsx`):

```typescript
try {
  if (typeof window !== "undefined") {
    const key = "signhify_pending_leads";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push({ ...result.data, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(prev));
  }
} catch { /* noop */ }
```

Manual recovery: check `localStorage.getItem("signhify_pending_leads")` in the browser console and forward to Piyush's email.

---

## 7. Dashboard: Lead View in Admin

Create a simple admin view at `/admin/leads` (or extend the existing `/app` dashboard):

```typescript
// src/routes/app/leads/index.tsx (future)
// Columns: name, email, company, type, budget, timeline, source, created_at, status
// Status: new, contacted, qualified, disqualified, converted
// Actions: mark contacted, send email, delete

// For now: manually query Supabase table `leads` at:
// supabase.from("leads").select("*").order("created_at", { ascending: false })
```

### Quick query for manual review

```sql
SELECT
  created_at,
  name,
  email,
  company,
  type,
  scope,
  budget,
  timeline,
  goals,
  source,
  message
FROM leads
ORDER BY created_at DESC
LIMIT 50;
```

Run this in the Supabase SQL editor to see all recent leads.

---

## 8. Lead Source Attribution

Track where each lead came from for campaign ROI analysis.

### URL parameter tracking

On every form page, read `utm_source` from the URL and pass it through:

```typescript
const params = new URLSearchParams(window.location.search);
const utmSource = params.get("utm_source") || "direct";
```

Include in the lead data:

```typescript
await submitLead({ data: { ...result.data, source: utmSource } });
```

### Campaign URL builder

Use these links in outreach:

| Campaign | URL | UTM tag |
|----------|-----|---------|
| ProductHunt launch | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=producthunt` | `producthunt` |
| LinkedIn post | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=linkedin` | `linkedin` |
| Twitter/X thread | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=twitter` | `twitter` |
| Cold email | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=email` | `email` |
| Indie Hackers | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=indiehackers` | `indiehackers` |
| GitHub README | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=github` | `github` |
| Directory listing | `https://signhify.dpdns.org/ai-mvp-builder?utm_source=directory` | `directory` |

---

## 9. Lead Lifecycle States

```
                    ┌──────────┐
                    │  New     │  ← Form submitted
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │ Contacted│  ← Piyush responded
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌─────────┐ ┌────────┐ ┌────────┐
        │Qualified│ │ Warm   │ │ Cold   │
        └────┬────┘ │Nurture │ │Nurture │
             │      └────────┘ └────────┘
        ┌────▼────┐
        │ Booked  │
        │ Call    │
        └────┬────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌───────┐ ┌──────┐ ┌──────┐
│ Won   │ │Lost  │ │Drop  │
│(client)│ │(no   │ │(ghost│
└───────┘ │ fit) │ │ / NR)│
          └──────┘ └──────┘
```

Track `status` in the `leads` table. Update manually after each interaction.

---

## Quick Start Implementation

1. **Copy the Resend API key** → add to `.env` as `RESEND_API_KEY`
2. **Copy the Slack webhook URL** → add to `.env` as `SLACK_WEBHOOK_URL`
3. **Update `leads.functions.ts`** to include auto-responder and Slack notification
4. **Create form pages** with proper source attribution (`utm_source` tracking)
5. **Check the `leads` table** in Supabase daily

---

*Last updated: July 2026*