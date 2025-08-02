-- Create maintenance settings table
CREATE TABLE IF NOT EXISTS public.maintenance_mode (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT false,
  message text DEFAULT 'MAINTENANCE BREAK',
  expected_downtime text DEFAULT '30 minutes',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default maintenance row
INSERT INTO public.maintenance_mode (is_active, message, expected_downtime) 
VALUES (false, 'MAINTENANCE BREAK', '30 minutes')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.maintenance_mode ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read maintenance status
CREATE POLICY "Everyone can read maintenance status" ON public.maintenance_mode
FOR SELECT USING (true);

-- Allow updates to maintenance mode  
CREATE POLICY "Allow maintenance updates" ON public.maintenance_mode
FOR UPDATE USING (true);

-- Simple function to give coins by email (using existing profiles table)
CREATE OR REPLACE FUNCTION simple_give_coins(
  target_email text,
  coin_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update existing profile or create new one
  INSERT INTO public.profiles (email, coin_balance, is_admin)
  VALUES (target_email, 500 + coin_amount, false)
  ON CONFLICT (email) 
  DO UPDATE SET 
    coin_balance = profiles.coin_balance + coin_amount,
    updated_at = now();
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;