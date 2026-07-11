ALTER TABLE public.user_ai_keys DROP COLUMN IF EXISTS api_key;
ALTER TABLE public.user_ai_keys ADD COLUMN IF NOT EXISTS api_key_encrypted TEXT NOT NULL DEFAULT '';
ALTER TABLE public.user_ai_keys ALTER COLUMN api_key_encrypted DROP DEFAULT;