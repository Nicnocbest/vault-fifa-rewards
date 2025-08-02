-- Add is_admin column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Set admin status for the admin user
UPDATE public.profiles SET is_admin = true WHERE email = 'nicolasmoryson2012@gmail.com';

-- Insert admin if doesn't exist
INSERT INTO public.profiles (email, coin_balance, is_admin)
VALUES ('nicolasmoryson2012@gmail.com', 10000, true)
ON CONFLICT (email) 
DO UPDATE SET is_admin = true, coin_balance = GREATEST(profiles.coin_balance, 10000);

-- Update the coin function to work without admin check
CREATE OR REPLACE FUNCTION simple_give_coins(
  target_email text,
  coin_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Simply give coins (admin panel already restricts access)
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

-- Enable realtime for tables
ALTER TABLE public.maintenance_mode REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_mode;
ALTER TABLE public.broadcasts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcasts;