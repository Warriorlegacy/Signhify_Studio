ALTER TABLE public.manual_payments
  ADD COLUMN IF NOT EXISTS listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'purchase';

CREATE INDEX IF NOT EXISTS manual_payments_listing_id_idx ON public.manual_payments(listing_id);

GRANT SELECT (listing_id, kind) ON public.manual_payments TO authenticated;
GRANT ALL ON public.manual_payments TO service_role;