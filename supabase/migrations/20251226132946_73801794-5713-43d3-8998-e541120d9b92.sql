-- Add explicit deny-all SELECT policy for nail_club_subscribers
-- This makes the security intent explicit and prevents any accidental exposure
-- No one can read subscriber data directly from the client
CREATE POLICY "No direct read access to subscribers"
ON public.nail_club_subscribers
FOR SELECT
USING (false);

-- Drop the permissive public INSERT policy
-- Subscriptions will now go through a secure Edge Function
DROP POLICY IF EXISTS "Anyone can subscribe to nail club" ON public.nail_club_subscribers;

-- Add email validation constraint to prevent malformed data
ALTER TABLE public.nail_club_subscribers
ADD CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add reasonable length limit on first_name
ALTER TABLE public.nail_club_subscribers
ADD CONSTRAINT reasonable_name_length CHECK (first_name IS NULL OR length(first_name) <= 50);