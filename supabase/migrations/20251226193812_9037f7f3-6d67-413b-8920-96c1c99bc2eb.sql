-- Add birthday column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Update the handle_new_user function to include birthday from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_birthday DATE;
BEGIN
  -- Validate and sanitize metadata with length limits (max 100 chars)
  v_first_name := TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 1, 100));
  v_last_name := TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'last_name', ''), 1, 100));
  
  -- Parse birthday from metadata if provided
  BEGIN
    v_birthday := (NEW.raw_user_meta_data->>'birthday')::DATE;
  EXCEPTION WHEN OTHERS THEN
    v_birthday := NULL;
  END;
  
  INSERT INTO public.profiles (user_id, email, first_name, last_name, birthday)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(v_first_name, ''),
    NULLIF(v_last_name, ''),
    v_birthday
  );
  RETURN NEW;
END;
$function$;