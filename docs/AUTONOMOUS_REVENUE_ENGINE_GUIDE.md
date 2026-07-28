# Autonomous Revenue Engine — User Guide

## What This Is

The Autonomous Revenue Engine is a set of backend systems that work together to generate revenue for Signhify AI Studio without manual intervention. It handles outreach emails, lead scoring, auto-proposals, content scheduling, and directory listings — all running on autopilot.

## Architecture Overview

```
External Cron (every 15 min)
    │
    ▼
POST /api/cron/revenue
    │
    ├──► Sends queued outreach emails via Resend
    ├──► Scores new leads (hot/warm/cold)
    ├──► Generates proposals for hot/warm leads
    └──► Emails proposals automatically
```

## Components

### 1. Outreach Automation
- **Location**: `src/lib/revenue/outreach.ts`
- **Purpose**: Sends personalized emails to prospects
- **How it works**:
  - Emails are stored in `outreach_sends` table with status `queued`
  - Cron picks them up when `scheduled_at <= now()`
  - Sends via Resend edge function (`supabase/functions/send-outreach-email/`)
  - Logs events to `outreach_events` table

### 2. Lead Scoring
- **Location**: `src/lib/revenue/lead-score.ts`
- **Purpose**: Automatically scores leads based on budget, timeline, goals, scope, and company
- **Tiers**:
  - **Hot** (≥70): High-value leads — send Studio/Platform proposal + book call
  - **Warm** (40-69): Medium-value leads — send case studies + nurture
  - **Cold** (<40): Low-value leads — add to nurture sequence
- **Factors**:
  - Budget: $299 sprint = 20pts, $799 studio = 40pts, $15K+ = 80pts
  - Timeline: Immediate/ASAP = 30pts, weeks = 20pts, months = 10pts
  - Goals: Urgent keywords = +10pts each, enterprise keywords = +8pts each
  - Scope: Full/platform = 30pts, studio = 20pts, sprint = 15pts
  - Company: +10pts if provided and >2 chars

### 3. Auto Proposals
- **Location**: `src/lib/revenue/auto-proposal.ts`
- **Purpose**: Generates tailored Sprint/Studio/Platform proposals automatically
- **Offer Selection**:
  - **Platform** ($15,000+, 30 days): Hot leads or $15K+ budget
  - **Studio** ($799, 7 days): Warm leads or $799 budget
  - **Sprint** ($299, 5 days): Everyone else
- **Proposal Includes**:
  - Custom summary with lead's name, company, scope, goals
  - Milestone timeline (day-by-day or week-by-week)
  - Price in USD
  - Next steps

### 4. Content Scheduler
- **Location**: `src/lib/revenue/content-scheduler.ts`
- **Purpose**: Schedules and tracks social media content
- **Platforms**: LinkedIn, Twitter, Instagram, YouTube
- **Statuses**: draft → scheduled → published → failed
- **API**:
  - `POST /api/revenue/content/schedule` — schedule new content
  - `GET /api/revenue/content/scheduled` — list upcoming content
  - `POST /api/revenue/content/published` — mark as published

### 5. Directory Listings
- **Location**: `src/lib/revenue/directory-listings.ts`
- **Purpose**: Tracks directory submissions and review status
- **Tracked Platforms**:
  - Clutch, GoodFirms, DesignRush, ProductHunt, Upwork
  - Google Business Profile, Crunchbase, AngelList, G2
  - Behance, Dribbble, Trustpilot, Sortlist, Bark, Manifest, ITFirms, Extract, VisualObjects, TopDevelopers
- **Statuses**: pending → submitted → approved → rejected

### 6. Cron Runner
- **Location**: `src/routes/api/cron/revenue.ts`
- **Endpoint**: `POST /api/cron/revenue`
- **Authentication**: Requires `CRON_REVENUE_SECRET` in request body
- **What it does**:
  1. Fetches queued `outreach_sends` where `scheduled_at <= now()`
  2. Sends each email via Resend
  3. Updates status to `sent` or `failed`
  4. Fetches all `leads`
  5. Scores each lead and saves to `lead_scores`
  6. For hot/warm leads: generates proposal and emails it
  7. Returns summary of processed items and errors

## Database Schema

### outreach_campaigns
- `id`, `name`, `channel`, `status`, `cadence_days`, `max_steps`, `active`, `metadata`, `created_at`, `updated_at`

### outreach_sends
- `id`, `campaign_id`, `lead_id`, `prospect_name`, `prospect_email`, `company`, `template_key`, `subject`, `body`, `status`, `provider`, `provider_message_id`, `scheduled_at`, `sent_at`, `next_send_at`, `error`, `metadata`, `created_at`, `updated_at`

### outreach_events
- `id`, `send_id`, `type`, `payload`, `created_at`
- Types: `sent`, `open`, `click`, `reply`, `bounce`

### lead_scores
- `id`, `lead_id`, `score`, `tier`, `signals`, `suggested_offer`, `suggested_next_action`, `created_at`, `updated_at`

### auto_proposals
- `id`, `lead_id`, `offer_type`, `price_cents`, `currency`, `timeline_days`, `summary`, `milestones`, `cal_link`, `status`, `sent_at`, `created_at`, `updated_at`

### content_schedule
- `id`, `title`, `body`, `platform`, `status`, `scheduled_at`, `published_at`, `post_url`, `metadata`, `created_at`, `updated_at`

### directory_listings
- `id`, `platform`, `url`, `status`, `priority`, `submitted_at`, `approved_at`, `review_url`, `notes`, `metadata`, `created_at`, `updated_at`

### revenue_events
- `id`, `source`, `source_id`, `amount_cents`, `currency`, `status`, `customer_email`, `customer_name`, `metadata`, `created_at`, `updated_at`

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `CRON_REVENUE_SECRET` | Authenticates cron endpoint | `5ab4b9bb...` |
| `SUPABASE_URL` | Supabase project URL | `https://nqeuarvpkxupxeeuzuow.supabase.co` |
| `SUPABASE_SECRET_KEY` | Supabase service role key | `sb_secret_...` |
| `RESEND_API_KEY` | Resend email API key (in Supabase secrets) | `re_...` |

## Setup Checklist

- [x] Migration applied (`20260729000003_autonomous_revenue.sql`)
- [x] Edge function deployed (`send-outreach-email`)
- [x] Seed data loaded (24 emails, 19 directories, 8 LinkedIn posts)
- [x] Environment variable set (`CRON_REVENUE_SECRET`)
- [x] Project redeployed
- [ ] External cron configured (see below)
- [ ] Outreach emails reviewed and personalized
- [ ] Directory listings submitted manually
- [ ] LinkedIn posts scheduled

## Next Steps

### 1. Configure External Cron

Set up a cron job to call the endpoint every 15 minutes:

**Service Options**:
- [cron-job.org](https://cron-job.org) (free, recommended)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://github.com/features/actions)
- [Cloudflare Workers Cron Trigger](https://developers.cloudflare.com/workers/platform/cron-triggers/)

**Configuration**:
- **URL**: `https://signhify.dpdns.org/api/cron/revenue`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "secret": "5ab4b9bb901631d6d58f6d29d5841e380ab6c9347170ecdd53916bf25631642d"
  }
  ```
- **Frequency**: Every 15 minutes

### 2. Review and Personalize Outreach Emails

The seed script loaded 24 emails from `scripts/generated-outreach/`. Review them:

1. Open each file in `scripts/generated-outreach/`
2. Replace placeholder names/companies with real prospects
3. Update `prospect_email` in `outreach_sends` table with real emails
4. Adjust `scheduled_at` to stagger sends (e.g., 2-3 per day)

**Quick way to update emails**:
```sql
UPDATE outreach_sends
SET prospect_email = 'real@email.com',
    scheduled_at = '2026-07-29T10:00:00Z'
WHERE id = 'uuid-here';
```

### 3. Submit Directory Listings

The 19 directories are loaded in `directory_listings` table. Start submitting:

1. **Week 1**: Clutch, GoodFirms, DesignRush
2. **Week 2**: ProductHunt, Upwork, Google Business Profile
3. **Week 3**: Crunchbase, AngelList, G2
4. **Week 4**: Behance, Dribbble, Trustpilot, others

For each:
1. Visit the directory URL from `directory_listings`
2. Submit your profile
3. Update status in DB: `UPDATE directory_listings SET status = 'submitted' WHERE platform = 'Clutch';`

### 4. Activate LinkedIn Content Calendar

8 posts are scheduled in `content_schedule` table. To publish:

1. Review posts in `content_schedule` table
2. Update `scheduled_at` to desired publish time
3. After publishing manually on LinkedIn, update DB:
   ```sql
   UPDATE content_schedule
   SET status = 'published',
       published_at = NOW(),
       post_url = 'https://linkedin.com/feed/update/...'
   WHERE id = 'uuid-here';
   ```

### 5. Monitor Revenue Events

Track all revenue activity in the `revenue_events` table:

```sql
-- See recent events
SELECT * FROM revenue_events ORDER BY created_at DESC LIMIT 50;

-- See events by source
SELECT source, COUNT(*), SUM(amount_cents) 
FROM revenue_events 
GROUP BY source;

-- See pending events
SELECT * FROM revenue_events WHERE status = 'pending';
```

## Monitoring & Maintenance

### Daily Checks
1. **Cron logs**: Check if external cron is calling successfully
2. **Outreach sends**: `SELECT COUNT(*) FROM outreach_sends WHERE status = 'queued';`
3. **Failed sends**: `SELECT * FROM outreach_sends WHERE status = 'failed';`
4. **New leads**: `SELECT COUNT(*) FROM leads WHERE created_at > NOW() - INTERVAL '1 day';`

### Weekly Checks
1. **Lead scores**: `SELECT tier, COUNT(*) FROM lead_scores GROUP BY tier;`
2. **Proposals sent**: `SELECT COUNT(*) FROM auto_proposals WHERE status = 'sent';`
3. **Directory progress**: `SELECT status, COUNT(*) FROM directory_listings GROUP BY status;`

### Monthly Checks
1. **Revenue events**: `SELECT SUM(amount_cents) FROM revenue_events WHERE status = 'completed';`
2. **Outreach metrics**: Track open/reply rates from `outreach_events`

## Troubleshooting

### Cron endpoint returns 401
- Check `CRON_REVENUE_SECRET` matches in both request and environment
- Verify secret is set in Lovable dashboard

### Emails not sending
- Check `outreach_sends` table for `status = 'failed'` and `error` column
- Verify Resend API key is set in Supabase secrets
- Check Resend dashboard for delivery issues

### Lead scoring not working
- Verify `leads` table has data
- Check `lead_scores` table for errors
- Ensure lead fields (budget, timeline, goals, scope) are populated

### Proposals not generating
- Check lead score tier (only hot/warm get proposals)
- Verify `auto_proposals` table for errors
- Check email delivery for proposal emails

## Revenue Targets

| Month | Target | Primary Sources |
|-------|--------|-----------------|
| Month 1 | $5,000 | Credit packs, 1-2 Sprint deals |
| Month 3 | $25,000 | Sprint/Studio deals, marketplace sales |
| Month 6 | $100,000 | Studio retainers, enterprise platform, marketplace commission |
| Month 12 | $1,000,000 | All channels scaled |

## Support

For issues or questions:
1. Check `session_context.md` for latest context
2. Review Supabase logs in dashboard
3. Check Lovable deployment logs
4. Email: Piyushrajsingh092@gmail.com
