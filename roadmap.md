# Signhify Workspace Setup Roadmap

## Done

1. Connect Google Search Console in the new workspace
2. Rebind Supabase secrets for the new workspace
3. Verify Supabase runtime secrets and service-role access
4. Wire real free AI API keys into the assistant chat
5. Address active marketplace asset_path security finding
6. Fix TypeScript errors in the AI blueprint page
7. Clear the five security findings (rate_limits policy, anonymous access, SECURITY DEFINER execute grants, search_path)
8. Stripe plan checkout on the pricing page (create session, confirm on return, unlock plan + credits)
9. Connect Resend and email every Notify Me sign-up to piyushrajsingh092@gmail.com
10. Remove the fake fallback blueprint — AI failures now surface a real retry message

## Pending (blocked)

- Add STRIPE_SECRET_KEY so live checkout works (the form was declined; checkout shows a friendly
  "payments not configured" message until it's saved)
- Verify a sending domain in Resend so notification emails can go to addresses other than the
  Resend account owner
- Signed-in walkthrough of hero → Scroll Studio save → creator publish (needs the owner to sign in
  in the preview; no session can be minted for this user-managed Supabase project)

## Payments, credits & creator tools (Sep 14 2026)
- [x] Extra credit packs (Spark 25/$10, Surge 60/$20, Fleet 150/$45, Vault 400/$100) with Stripe one-off checkout + idempotent credit top-up
- [x] Credit balance shown on /pricing via getMyEntitlements
- [x] Creator dashboard at /creator — list, edit, publish/unpublish, delete own listings (RLS delete policy added)
- [x] Template master prompts gated: teaser for free users, full prompt for paid plans
- [ ] BLOCKED: card checkout needs STRIPE_SECRET_KEY (built-in payments unavailable for seller country IN; user declined to paste the key)
- [ ] BLOCKED: Resend sending domain signhify.dpdns.org not yet verified — alerts only reach the Resend account owner
- [ ] BLOCKED: signed-in walkthrough (hero -> Scroll Studio save -> publish) — no way to mint a session on the user-managed Supabase
