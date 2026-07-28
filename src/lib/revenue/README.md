# Autonomous Revenue Engine

This directory contains the autonomous revenue pipeline for Signhify AI Studio. It is designed to run without manual intervention and generate qualified leads, proposals, and revenue events through scheduled automation.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ External Cron (cron-job.org / EasyCron / Cloudflare)    │
│ Calls: POST /api/cron/revenue                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Cron Runner (src/routes/api/cron/revenue.ts)            │
│ - Auth via CRON_REVENUE_SECRET                          │
│ - Processes queued outreach sends                       │
│ - Scores new leads                                      │
│ - Generates proposals for hot/warm leads                │
└──────────────┬──────────────────────────┬────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌────────────────────────────┐
│ Outreach Module           │  │ Lead Scoring Module         │
│ src/lib/revenue/outreach  │  │ src/lib/revenue/lead-score  │
│ - sendOutreachEmail()     │  │ - computeLeadScore()        │
│ - Resend via Edge Func    │  │ - scoreLead() server fn     │
└──────────────┬───────────┘  └──────────────┬─────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────┐
│ Supabase Tables                                         │
│ outreach_campaigns, outreach_sends, outreach_events      │
│ lead_scores, auto_proposals, content_schedule            │
│ directory_listings, revenue_events                       │
└─────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│ Email Delivery                                          │
│ supabase/functions/send-outreach-email                  │
│ - Resend API                                            │
│ - From: Signhify <Piyushrajsingh092@gmail.com>          │
└─────────────────────────────────────────────────────────┘
```

## Setup

1. **Apply the migration**:
   ```bash
   supabase migration up
   ```

2. **Deploy the edge function**:
   ```bash
   supabase functions deploy send-outreach-email
   ```

3. **Set environment variables**:
   ```bash
   CRON_REVENUE_SECRET=<random-secret>
   ```

4. **Seed initial data**:
   ```bash
   npx tsx scripts/seed-autonomous-revenue.ts
   ```

5. **Configure external cron**:
   - URL: `https://signhify.dpdns.org/api/cron/revenue`
   - Method: POST
   - Body: `{ "secret": "<CRON_REVENUE_SECRET>" }`
   - Frequency: every 15 minutes

## Modules

### Outreach (`src/lib/revenue/outreach.ts`)
- `sendOutreachEmail` — sends a single outreach email via Resend edge function
- Logs sent/open/click/reply events to `outreach_events`

### Lead Scoring (`src/lib/revenue/lead-score.ts`)
- `computeLeadScore` — deterministic scoring based on budget, timeline, goals, scope, company
- `scoreLead` — server function that persists score to `lead_scores`

### Auto Proposals (`src/lib/revenue/auto-proposal.ts`)
- `generateProposal` — creates a tailored Sprint/Studio/Platform proposal
- Sends proposal email to lead automatically

### Content Scheduler (`src/lib/revenue/content-scheduler.ts`)
- `scheduleContent` — adds content to `content_schedule`
- `listScheduledContent` — lists upcoming scheduled content
- `markContentPublished` — marks content as published with post URL

### Directory Listings (`src/lib/revenue/directory-listings.ts`)
- `upsertDirectoryListing` — adds/updates a directory listing
- `listDirectoryListings` — lists all tracked listings
- `updateDirectoryListing` — updates status/notes/review URL

## Revenue Events

Revenue events are logged to `revenue_events` whenever:
- An outreach email is sent
- A lead is scored hot/warm
- A proposal is generated
- Content is published
- A directory listing is approved

## Security

- All cron endpoints require `CRON_REVENUE_SECRET`
- Supabase service role is used for all DB operations
- RLS policies restrict access to service_role and authenticated users
