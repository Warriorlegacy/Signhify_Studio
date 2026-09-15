ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS promo_video_url text;
GRANT SELECT (promo_video_url) ON public.marketplace_listings TO anon, authenticated;
GRANT UPDATE (promo_video_url) ON public.marketplace_listings TO authenticated;

CREATE TABLE IF NOT EXISTS public.promo_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.user_projects(id) ON DELETE SET NULL,
  listing_slug text,
  job_id text,
  prompt text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  video_url text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.promo_videos TO authenticated;
GRANT ALL ON public.promo_videos TO service_role;

ALTER TABLE public.promo_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promo_videos_select_own" ON public.promo_videos
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

CREATE POLICY "promo_videos_insert_own" ON public.promo_videos
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

CREATE POLICY "promo_videos_update_own" ON public.promo_videos
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "promo_videos_delete_own" ON public.promo_videos
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

CREATE INDEX IF NOT EXISTS promo_videos_user_idx ON public.promo_videos (user_id, created_at DESC);

CREATE TRIGGER promo_videos_updated_at BEFORE UPDATE ON public.promo_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();