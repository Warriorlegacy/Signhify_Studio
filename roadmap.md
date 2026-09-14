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
