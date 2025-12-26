-- Add shipping address fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS shipping_address_line1 text,
  ADD COLUMN IF NOT EXISTS shipping_address_line2 text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_state text,
  ADD COLUMN IF NOT EXISTS shipping_zip text,
  ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'US';

-- Create drop_claims table for tracking monthly drop claims
CREATE TABLE public.drop_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month text NOT NULL,
  status text NOT NULL DEFAULT 'claimed',
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  address_snapshot jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT drop_claims_status_check CHECK (status IN ('claimed', 'shipped')),
  CONSTRAINT drop_claims_user_month_unique UNIQUE (user_id, month)
);

-- Enable RLS
ALTER TABLE public.drop_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drop_claims
CREATE POLICY "Users can view their own claims"
  ON public.drop_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims"
  ON public.drop_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);