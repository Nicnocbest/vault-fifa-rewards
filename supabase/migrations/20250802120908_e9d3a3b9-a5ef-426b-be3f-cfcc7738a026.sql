-- Fix RLS policies for broadcasts
DROP POLICY IF EXISTS "Admins can manage broadcasts" ON broadcasts;
DROP POLICY IF EXISTS "Anyone can read active broadcasts" ON broadcasts;

-- Create proper policies that work without authentication for now
CREATE POLICY "Public can read active broadcasts" ON broadcasts
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can insert broadcasts" ON broadcasts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update broadcasts" ON broadcasts
FOR UPDATE USING (true);