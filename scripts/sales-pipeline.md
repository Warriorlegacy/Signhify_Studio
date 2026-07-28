# Signhify AI Studio — Sales Pipeline Playbook

> Nine stages from lead to referral. Each stage has a trigger, owner, expected duration, and a concrete next action.
> Keep this open on every call. Update your stage after every interaction.

---

## Pipeline Diagram

```
┌──────────┐   ┌──────────┐   ┌────────┐   ┌──────────┐   ┌────────┐   ┌────────────┐   ┌────────┐   ┌──────────┐   ┌──────────┐
│ 1. Lead  │──▶│ 2. Initial│──▶│ 3. Disc│──▶│ 4. Blue │──▶│ 5. Prop│──▶│ 6. Negoti- │──▶│ 7. Clos│──▶│ 8. Deli- │──▶│ 9. Refer │
│ Sourced  │   │ Contact   │   │ Call   │   │ Print   │   │osal    │   │ ation      │   │ed W/L  │   │ vered    │   │ Request  │
└──────────┘   └──────────┘   └────────┘   └──────────┘   └────────┘   └────────────┘   └────────┘   └──────────┘   └──────────┘
```

---

## Stage 1 — Lead Sourced

| Field | Detail |
|---|---|
| **Trigger** | Prospect enters pipeline via any channel |
| **Owner** | Piyush |
| **Expected duration** | < 24 hours before first contact |
| **Exit criteria** | First outreach sent (email/DM/LinkedIn) |

### Lead sources (ranked by conversion probability)

| Source | Est. conversion | How to source | Tools |
|--------|---------------|--------------|-------|
| 🔥 ProductHunt launches | 8-15% | Monitor PH daily for new AI/SaaS launches; DM founders within 24h of their launch | producthunt.com |
| 🔥 Indie Hackers posts | 5-12% | Search "building", "MVP", "agency problems" on IH; engage in comments before DM | indiehackers.com |
| 🔥 GitHub trending | 3-8% | Starred new repos in ai/llm/saas categories; DM maintainers | github.com/trending |
| 🟡 LinkedIn outreach | 2-5% | Founders posting about technical challenges, fundraising, or building | LinkedIn Sales Nav |
| 🟡 Warm referral | 20-40% | Past clients or network contacts | Email/WhatsApp |
| 🟢 Website contact form | 3-10% | Inbound via signhify.dpdns.org/contact | Supabase `leads` table |
| 🔵 Cold email | 1-3% | Manual research + personalized outreach | HubSpot/Brevo |

### Priority scoring (assign before Stage 2)

Score each lead 1-3:

- **Need clarity** (1-4): Vague idea ↔ Clear spec ↔ Urgent deadline
- **Budget signal** (1-3): "Exploring" ↔ "Have budget" ↔ "Approved budget"
- **Authority** (1-3): "Need to check" ↔ "Decision maker" ↔ "Has final say"
- **Timeline** (1-3): "Someday" ↔ "This quarter" ↔ "This month"

**Total / 12**: 10+ = Hot (skip to Stage 3 direct), 6-9 = Warm, <6 = Nurture

---

## Stage 2 — Initial Contact

| Field | Detail |
|---|---|
| **Trigger** | Lead scored ≥ 6, first message drafted |
| **Owner** | Piyush |
| **Expected duration** | 1-3 days |
| **Exit criteria** | Prospect replies with interest, or 3 touches sent without reply (move to cold nurture) |

### Channel selection

| Lead source | Primary channel | Secondary |
|---|---|---|
| ProductHunt | Twitter/X DM | Email (from PH profile) |
| Indie Hackers | Indie Hackers DM | Email |
| GitHub | GitHub discussion | Email (from GitHub profile) |
| LinkedIn | LinkedIn DM | Email |
| Referral | Email (warm intro) | WhatsApp |
| Website form | Email (auto-responder first) | Phone |
| Cold email | Email | LinkedIn |

### Outreach templates to use (from outreach-email-templates.md)

| Segment | Template | Subject line |
|---|---|---|
| SaaS founder (PH) | Cold #1 | `Quick question re: [Company]'s AI product plans` |
| Indie hacker | Cold #1 (indie variant) | `Built your MVP in 5 days — $299` |
| Agency owner | Partnership #1 | `White-label dev partner for [Agency]` |
| Referral | Warm intro | `[Referrer] suggested I reach out` |

### If they reply → move to Stage 3. If no reply → two more touches (Day 4, Day 8) → then cold nurture.

---

## Stage 3 — Discovery Call

| Field | Detail |
|---|---|
| **Trigger** | Prospect replies with interest, asks for more info, or agrees to a call |
| **Owner** | Piyush |
| **Expected duration** | 3-7 days (from reply → call completed) |
| **Exit criteria** | Call completed AND mutual agreement to proceed to a blueprint |

### Pre-call preparation (15 min)

- [ ] Read the prospect's LinkedIn profile, recent posts, company website
- [ ] If from PH: read their product page, comments, reviews
- [ ] If from GitHub: review their repo, issues, README
- [ ] Prepare 3 specific questions about their product/industry
- [ ] Open the AI blueprint generator ready to demo

### Call structure

| Time | Topic | Your goal |
|------|-------|-----------|
| 0-3 min | Rapport + context | "What's the problem you're solving?" |
| 3-12 min | Deep discovery (70% listening) | Understand pain, budget, timeline, authority |
| 12-18 min | Demo the AI blueprint generator | Show, don't tell |
| 18-22 min | Pricing + next steps | Propose a Sprint or Studio |
| 22-25 min | Close + schedule blueprint call | Book it before hanging up |

### Discovery questions (always ask)

1. "What's the single biggest problem you're trying to solve?"
2. "Who is this for? Have you talked to potential users?"
3. "What's your timeline? What's driving that?"
4. "What budget have you set aside for this phase?"
5. "Who else needs to sign off on this decision?"
6. "What happens if you don't build this?"
7. "Have you worked with developers/agencies before? How was that?"

### Qualification criteria (must-pass to proceed)

- [ ] Clear problem identified (not "I have an idea, what should I build?")
- [ ] Budget exists or is accessible ($299-$799+ range)
- [ ] Decision maker is on the call or committed to intro
- [ ] Timeline is < 3 months
- [ ] No disqualifiers (sounds like a bad fit for our model)

### If qualified → Book blueprint call (Stage 4)
### If not qualified → Send "not a fit" email with referral to resources

---

## Stage 4 — Blueprint Call

| Field | Detail |
|---|---|
| **Trigger** | Discovery completed, mutual fit confirmed |
| **Owner** | Piyush |
| **Expected duration** | 1-5 days |
| **Exit criteria** | Blueprint delivered + pricing shared + prospect requests proposal |

### What happens on the blueprint call

1. **Review the AI-generated architecture** (from the blueprint generator)
2. **Walk through** the schema, routes, UI components, and security model
3. **Scope refinement** — what's in v1, what's deferred
4. **Timeline estimate** — Sprint (5-7 days) vs Studio (14 days)
5. **Pricing** — share fixed price for their scope
6. **Risk reversal** — "If we don't deliver on time, next sprint is free"
7. **Close** — "Should I send you the formal proposal?"

### Deliver the blueprint

After the call, within 24 hours:

- ✅ Architecture overview (1-page PDF)
- ✅ PostgreSQL schema (DDL)
- ✅ Route tree + API endpoints
- ✅ UI component list
- ✅ Deployment architecture
- ✅ Fixed-price proposal (or refer to Stage 5)

### If they say yes → send formal proposal (Stage 5)
### If they need time → set follow-up in 7 days
### If they say no → document reason, tag for re-engagement in 6 months

---

## Stage 5 — Proposal Sent

| Field | Detail |
|---|---|
| **Trigger** | Prospect requests formal proposal after blueprint call |
| **Owner** | Piyush |
| **Expected duration** | 3-14 days (under review) |
| **Exit criteria** | Verbal yes (→ Stage 6) or no (→ Stage 7 lost) |

### Proposal structure

Sent as a 1-page Google Doc or PDF. Contains:

1. **Executive summary** (2-3 sentences showing you listened)
2. **Scope of work** — exactly what will be built
3. **Exclusions** — what is NOT in scope
4. **Technology stack** — TanStack, Supabase, Stripe, etc.
5. **Timeline** — Sprint (5-7 days) or Studio (14 days)
6. **Investment** — fixed price, payment terms
7. **Deliverables** — GitHub repo, deployment URL, documentation
8. **Terms** — payment schedule, revision policy, code ownership

### Follow-up cadence

| Day | Action |
|-----|--------|
| 0 | Send proposal + schedule 24h check-in |
| 1 | Check in: "Did you have any questions?" |
| 4 | Follow-up: share a relevant case study or testimonial |
| 7 | Follow-up: "Any blockers I can help with?" |
| 14 | Breakup: "I'll close this out — reach out when timing is right" |

---

## Stage 6 — Negotiation

| Field | Detail |
|---|---|
| **Trigger** | Prospect says "yes in principle" but has conditions |
| **Owner** | Piyush |
| **Expected duration** | 1-7 days |
| **Exit criteria** | Signed agreement (→ Stage 7 won) or walk away (→ Stage 7 lost) |

### Common negotiation points

| Their ask | Your response |
|---|---|
| "Can you lower the price?" | "I can offer a payment plan: 50% upfront, 50% on delivery. The price is fixed because scope is fixed." |
| "We need more features" | "Let's split: v1 as proposed (on time). V2 in a second sprint (separate proposal)." |
| "Add a maintenance retainer" | "We don't do retainers. You'll have the full code and CI/CD pipeline. If you need changes, you can commission a new sprint." |
| "We need it faster" | "I can prioritize your project for a rush fee (50% of sprint price)." |
| "Can you sign an NDA?" | "Yes, but the conversation is worth more than the NDA. I'm happy to review yours or use mine (standard mutual NDA)." |

### Walk-away triggers

- They want equity instead of cash
- They want unlimited revisions at fixed price
- They refuse to put 50% upfront
- They fundamentally don't trust the process (better to part ways)

---

## Stage 7 — Closed Won / Closed Lost

### Won

| Field | Detail |
|---|---|
| **Trigger** | Signed proposal + 50% payment received |
| **Owner** | Piyush |
| **Expected duration** | N/A (project starts) |
| **Next action** | Create GitHub repo, share with client, set up project board |

**Celebration**: Send a thank-you message. Share the private repo link within 1 hour of payment.

### Lost

| Field | Detail |
|---|---|
| **Trigger** | Prospect declines or ghosts after Stage 5 |
| **Owner** | Piyush |
| **Expected duration** | 30 min to document |
| **Next action** | Log reason, set 6-month re-engagement reminder |

**Re-engagement triggers** (set calendar reminders):
- 3 months: Share a case study or new feature
- 6 months: "We're still here — any change in priorities?"
- Trigger event: If they launch a product, get funding, or post about building

---

## Stage 8 — Delivered

| Field | Detail |
|---|---|
| **Trigger** | Full code transferred + deployment live |
| **Owner** | Piyush |
| **Expected duration** | Sprint: 5-7 days. Studio: 14 days. |
| **Exit criteria** | Client confirms acceptance + final payment received |

### Delivery checklist

- [ ] Full source code pushed to client's GitHub repo (private)
- [ ] README with setup instructions
- [ ] CI/CD pipeline operational
- [ ] Custom domain configured (if Sprint) or $299 add-on for Studio
- [ ] Stripe billing active (if applicable)
- [ ] BYOK vault working (if applicable)
- [ ] Client email + OAuth login working
- [ ] 30-min handoff call: walk through the codebase
- [ ] 30-day support window explained (bug fixes, not new features)
- [ ] Invoice sent for remaining 50%

### Handoff call agenda

1. Tour of the repo structure
2. How to run locally
3. How to deploy updates
4. How to manage Stripe subscriptions
5. How the BYOK vault works (if included)
6. How to get support (direct WhatsApp/email, 24h response)

---

## Stage 9 — Referral Request

| Field | Detail |
|---|---|
| **Trigger** | 30-60 days after delivery (wait for them to feel the value) |
| **Owner** | Piyush |
| **Expected duration** | 1 day to send. Lifetime value: referrals. |
| **Exit criteria** | Referral made, or explicit "not right now" |

### Referral request email (from outreach-email-templates.md)

Send 30-60 days after project completion. Template in `scripts/outreach-email-templates.md`.

### Ask hierarchy (from least to most effort for the client)

1. "Do you know another founder who needs a SaaS built?"
2. "Would you be open to a 2-3 sentence review on Clutch/Trustpilot?"
3. "Can I use a line from your earlier feedback as a testimonial?"
4. "Would you be open to a 15-min case study interview?"

### Incentive

15% off their next engagement for every referral who signs.

---

## Pipeline Health Metrics

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Leads in Stage 1 | > 20 | 10-20 | < 10 |
| Conversion Stage 2→3 | > 30% | 15-30% | < 15% |
| Conversion Stage 3→4 | > 60% | 40-60% | < 40% |
| Conversion Stage 4→5 | > 80% | 60-80% | < 60% |
| Conversion Stage 5→7 (won) | > 50% | 30-50% | < 30% |
| Avg time Stage 1→7 | < 30 days | 30-60 days | > 60 days |
| Active proposals out | 3-5 | 1-2 | 0 |

---

## Pipeline Tracker Template

Copy this into a Google Sheet or Notion:

```
┌───────────┬────────────┬──────────┬──────────────┬────────────┬────────────┐
│ Prospect  │ Source      │ Stage    │ Next action   │ Date added │ Est. value │
├───────────┼────────────┼──────────┼──────────────┼────────────┼────────────┤
│ ExampleCo │ ProductHunt │ 3. Disc  │ Blueprint     │ 2026-07-20 │ $799       │
│           │            │          │ call Tue 3p   │            │            │
│           │            │          │               │            │            │
└───────────┴────────────┴──────────┴──────────────┴────────────┴────────────┘
```

**Fields**: Prospect | Source | Stage | Next Action | Date Added | Last Contacted | Est. Value | Notes

---

*Last updated: July 2026*