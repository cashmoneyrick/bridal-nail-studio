-- Fix 1: Add input validation to handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Validate and sanitize metadata with length limits (max 100 chars)
  v_first_name := TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 1, 100));
  v_last_name := TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'last_name', ''), 1, 100));
  
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(v_first_name, ''),
    NULLIF(v_last_name, '')
  );
  RETURN NEW;
END;
$$;

-- Fix 2: Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);