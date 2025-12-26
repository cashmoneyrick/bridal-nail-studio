-- Add has_purchased flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_purchased boolean DEFAULT false;

-- Create birthday_claims table
CREATE TABLE public.birthday_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  year integer NOT NULL,
  gift_type text NOT NULL,
  years_with_us integer NOT NULL,
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  discount_code text,
  shipped boolean DEFAULT false,
  address_snapshot jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT birthday_claims_year_check CHECK (year >= 2020 AND year <= 2100),
  UNIQUE (user_id, year)
);

-- Enable Row Level Security
ALTER TABLE public.birthday_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own birthday claims"
  ON public.birthday_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own birthday claims"
  ON public.birthday_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_birthday_claims_user_year ON public.birthday_claims(user_id, year);