-- Create custom_orders table
CREATE TABLE public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Base product info
  base_product_handle TEXT,
  
  -- Shape, length, finish
  shape TEXT NOT NULL,
  length TEXT NOT NULL,
  finish TEXT NOT NULL,
  
  -- Colors (primary palette + nail-specific colors)
  colors JSONB DEFAULT '{}'::jsonb,
  
  -- Accent nails configuration
  accent_nails JSONB DEFAULT '[]'::jsonb,
  
  -- Effects (chrome, glitter, french, etc.)
  effects JSONB DEFAULT '[]'::jsonb,
  
  -- Add-ons
  rhinestones_tier TEXT DEFAULT 'none',
  charms_tier TEXT DEFAULT 'none',
  charms_preferences TEXT,
  
  -- Artwork
  artwork_type TEXT DEFAULT 'none' CHECK (artwork_type IN ('none', 'predefined', 'custom', 'both')),
  artwork_selections JSONB DEFAULT '[]'::jsonb,
  custom_artwork_description TEXT,
  inspiration_images TEXT[] DEFAULT '{}',
  
  -- Pricing
  estimated_price DECIMAL(10,2),
  requires_quote BOOLEAN DEFAULT FALSE,
  
  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled')),
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.custom_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone (authenticated or anonymous) to create orders
CREATE POLICY "Anyone can create orders"
  ON public.custom_orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can update their own orders
CREATE POLICY "Users can update their own orders"
  ON public.custom_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_custom_orders_updated_at
  BEFORE UPDATE ON public.custom_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for custom artwork
INSERT INTO storage.buckets (id, name, public)
VALUES ('custom-artwork', 'custom-artwork', true);

-- Storage RLS policies
-- Allow anyone to upload artwork images
CREATE POLICY "Anyone can upload artwork images"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'custom-artwork');

-- Allow public read access for artwork
CREATE POLICY "Public read access for artwork"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'custom-artwork');