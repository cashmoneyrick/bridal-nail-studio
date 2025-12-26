-- Fix 1: Make custom-artwork bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'custom-artwork';

-- Remove public read access policy
DROP POLICY IF EXISTS "Public read access for artwork" ON storage.objects;

-- Remove anonymous upload policy 
DROP POLICY IF EXISTS "Anyone can upload artwork images" ON storage.objects;

-- Create authenticated-only upload policy
CREATE POLICY "Authenticated users can upload artwork" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'custom-artwork');

-- Create authenticated-only read policy (users can only read their own order images)
-- Since we store files as {orderId}/filename, we need service role access for now
-- Admins/service role will handle serving signed URLs
CREATE POLICY "Authenticated users can view artwork" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'custom-artwork');

-- Fix 2: Add explicit anonymous blocking policies for PII tables

-- Block anonymous access to profiles
CREATE POLICY "Block anonymous access to profiles" 
ON profiles 
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

-- Block anonymous access to birthday_claims
CREATE POLICY "Block anonymous access to birthday_claims" 
ON birthday_claims 
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

-- Block anonymous access to drop_claims
CREATE POLICY "Block anonymous access to drop_claims" 
ON drop_claims 
FOR ALL 
TO anon 
USING (false)
WITH CHECK (false);

-- Block anonymous access to custom_orders (contains personal order data)
CREATE POLICY "Block anonymous access to custom_orders" 
ON custom_orders 
FOR SELECT 
TO anon 
USING (false);