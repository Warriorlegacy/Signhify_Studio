DROP POLICY IF EXISTS "Users manage own manual payments" ON public.manual_payments;
CREATE POLICY "Users manage own manual payments"
  ON public.manual_payments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (auth.uid() = user_id AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);