CREATE TABLE public.rate_limits (
  ip text NOT NULL,
  window_start timestamptz NOT NULL,
  count int NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, window_start)
);
GRANT SELECT, INSERT, UPDATE ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rate_limits_service_role_all" ON public.rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);
