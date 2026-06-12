-- Add columns to user_projects for Signhify Scroll Studio
ALTER TABLE public.user_projects 
  ADD COLUMN IF NOT EXISTS current_html text,
  ADD COLUMN IF NOT EXISTS current_css text,
  ADD COLUMN IF NOT EXISTS current_js text,
  ADD COLUMN IF NOT EXISTS frame_metadata jsonb,
  ADD COLUMN IF NOT EXISTS settings jsonb,
  ADD COLUMN IF NOT EXISTS conversation_history jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS published_url text;

-- Create video_jobs table
CREATE TABLE public.video_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  model text NOT NULL,
  input_type text NOT NULL,
  input_image_url text,
  duration_seconds integer NOT NULL DEFAULT 8,
  aspect_ratio text NOT NULL DEFAULT '16:9',
  status text NOT NULL DEFAULT 'queued',
  external_job_id text,
  video_url text,
  frame_count integer,
  processing_time_ms integer,
  cost_usd numeric,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Setup RLS and permissions for video_jobs
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_jobs TO authenticated;
GRANT ALL ON public.video_jobs TO service_role;
ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_video_jobs ON public.video_jobs 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

-- Create frames table
CREATE TABLE public.frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_job_id uuid NOT NULL REFERENCES public.video_jobs(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.user_projects(id) ON DELETE CASCADE,
  frame_index integer NOT NULL,
  cdn_url text NOT NULL,
  width integer,
  height integer,
  file_size_bytes integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Setup RLS and permissions for frames
GRANT SELECT, INSERT, UPDATE, DELETE ON public.frames TO authenticated;
GRANT ALL ON public.frames TO service_role;
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_frames ON public.frames 
  USING (
    project_id IN (
      SELECT id FROM public.user_projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.user_projects WHERE user_id = auth.uid()
    )
  );
