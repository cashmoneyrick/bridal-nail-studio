-- Create user_addresses table
CREATE TABLE public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  apartment_unit TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anonymous access to user_addresses"
  ON public.user_addresses FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Users can view their own addresses
CREATE POLICY "Users can view their own addresses" 
  ON public.user_addresses FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert their own addresses" 
  ON public.user_addresses FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update their own addresses" 
  ON public.user_addresses FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete their own addresses" 
  ON public.user_addresses FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);