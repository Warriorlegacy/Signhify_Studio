GRANT SELECT (status, review_note, reviewed_at) ON public.marketplace_listings TO authenticated;
GRANT SELECT (status) ON public.marketplace_listings TO anon;
GRANT UPDATE (status, review_note, reviewed_at) ON public.marketplace_listings TO authenticated;
GRANT INSERT (status, review_note, reviewed_at) ON public.marketplace_listings TO authenticated;