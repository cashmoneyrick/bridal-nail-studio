-- Create the nail club subscribers table
CREATE TABLE IF NOT EXISTS nail_club_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'nail_club_page'
);

-- Enable Row Level Security
ALTER TABLE nail_club_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous and authenticated users to INSERT only
CREATE POLICY "Anyone can subscribe to nail club"
ON nail_club_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies for anon = subscriber list protected