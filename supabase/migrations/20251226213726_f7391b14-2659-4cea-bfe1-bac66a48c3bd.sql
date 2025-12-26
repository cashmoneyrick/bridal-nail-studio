-- Drop the permissive "Anyone can create orders" policy that allows anonymous inserts
DROP POLICY IF EXISTS "Anyone can create orders" ON custom_orders;

-- Create a new restrictive policy that only allows authenticated users to insert their own orders
-- Note: The edge function uses service role to bypass RLS, so this blocks direct anonymous inserts
CREATE POLICY "Authenticated users can create orders via API" 
ON custom_orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also allow inserts where user_id is null (for guest orders created via edge function)
-- But since we use service role in the edge function, this is mainly for documentation
-- The key security is that direct client inserts are blocked for anon users