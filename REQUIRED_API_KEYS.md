# Signhify Scroll Studio - Required API Keys & Secrets

To fully enable the features implemented in Phase 1-5, please ensure the following environment variables are set in your deployment environment (Lovable Cloud / Vercel / local .env).

## 1. Supabase (Database & Auth)

- `SUPABASE_URL`: (https://nqeuarvpkxupxeeuzuow.supabase.co).
- `SUPABASE_PUBLISHABLE_KEY`: sb_publishable_5Fp5S3g248-6VLG3VwQ0Mw\_\_zdpDXg5.
- `SUPABASE_SERVICE_ROLE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZXVhcnZwa3h1cHhlZXV6dW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU3MTUxNCwiZXhwIjoyMDk2MTQ3NTE0fQ.BXoqECJYjjaaIjIALNQgEQC0qUiF6ZnLjl8P5UVcf8w
- `SUPABASE_DB_PASSWORD`: NlKvPYRBksGUa5Vj.

## 2. Video Generation (Runway ML)

- `RUNWAY_API_KEY`: Required for real AI video generation. Used in `src/lib/video-generation.functions.ts`.

## 3. Monetization (Stripe)

- `STRIPE_SECRET_KEY`: Your Stripe secret key for creating checkout sessions. Used in `src/lib/monetization.functions.ts`.
- `NEXT_PUBLIC_SITE_URL`: The base URL of your deployed site (e.g., https://signhify.com) for Stripe redirect success/cancel URLs.

## 4. AI Gateway (Auto-Fallback Pipeline)

The project now uses a resilient, multi-provider AI gateway. The system will automatically fallback to the next available provider if one hits a rate limit or fails. Please provide as many as possible:

- `OPENROUTER_API_KEY`: (Primary) Access to Claude 3.5 Sonnet and other free models.
- `GROQ_API_KEY`: (High Speed) Access to Llama 3.3 70B and Mixtral.
- `GEMINI_API_KEY`: (Reliable Free Tier) Access to Google's Gemini 1.5 Flash.
- `CEREBRAS_API_KEY`: (Ultra Fast) Access to Llama 3.1 70B.
- `XAI_API_KEY`: Access to Grok-beta.
- `NVIDIA_API_KEY`: Access to NVIDIA NIM models.
- `MISTRAL_API_KEY`: Access to Mistral Small/Tiny.
- `COHERE_API_KEY`: Access to Command R+.

## 5. Other Integrations (Optional)

- `CLOUDFLARE_API_TOKEN`: If using the Cloudflare domain functions.
- `RESEND_API_KEY`: If using waitlist/email notifications.
- `GITHUB_TOKEN`: For GitHub integration features.
