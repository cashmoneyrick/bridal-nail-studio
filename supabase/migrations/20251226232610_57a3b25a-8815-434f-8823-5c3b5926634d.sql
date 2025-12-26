-- Create nail_profiles table for storing user nail size profiles
CREATE TABLE public.nail_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  sizes JSONB NOT NULL DEFAULT '{}',
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure unique profile names per user
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.nail_profiles ENABLE ROW LEVEL SECURITY;

-- Block anonymous access
CREATE POLICY "Block anonymous access to nail_profiles"
  ON public.nail_profiles FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- RLS Policies: Users can only access their own profiles
CREATE POLICY "Users can view their own nail profiles" 
  ON public.nail_profiles FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nail profiles" 
  ON public.nail_profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nail profiles" 
  ON public.nail_profiles FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nail profiles" 
  ON public.nail_profiles FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_nail_profiles_updated_at
  BEFORE UPDATE ON public.nail_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();