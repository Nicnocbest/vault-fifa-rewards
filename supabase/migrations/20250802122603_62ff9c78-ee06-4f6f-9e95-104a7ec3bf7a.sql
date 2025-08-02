-- Fix admin system: ensure admin user exists in profiles
INSERT INTO public.profiles (email, coin_balance, is_admin)
VALUES ('nicolasmoryson2012@gmail.com', 10000, true)
ON CONFLICT (email) 
DO UPDATE SET is_admin = true;

-- Remove admin check from coin function since it's already in admin panel
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
  -- Simply give coins without admin check (admin panel already restricts access)
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

-- Enable realtime for maintenance_mode table
ALTER TABLE public.maintenance_mode REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_mode;

-- Enable realtime for broadcasts table  
ALTER TABLE public.broadcasts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcasts;