ALTER TABLE public.waitlist 
ADD COLUMN confirmed boolean NOT NULL DEFAULT false,
ADD COLUMN confirmed_at timestamptz;
