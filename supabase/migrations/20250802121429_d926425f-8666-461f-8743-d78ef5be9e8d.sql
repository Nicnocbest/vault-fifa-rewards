-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  coin_balance integer DEFAULT 500,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (email = current_setting('app.current_user_email', true) OR true);

CREATE POLICY "Anyone can create profile" ON public.profiles
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (email = current_setting('app.current_user_email', true) OR true);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (true);

-- Function to give coins to user
CREATE OR REPLACE FUNCTION give_coins_to_user(
  user_email text,
  amount integer,
  admin_email text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  admin_check boolean;
BEGIN
  -- Check if admin
  SELECT is_admin INTO admin_check FROM public.profiles WHERE email = admin_email;
  
  IF NOT admin_check THEN
    RETURN false;
  END IF;
  
  -- Update user coins
  UPDATE public.profiles 
  SET coin_balance = coin_balance + amount,
      updated_at = now()
  WHERE email = user_email;
  
  -- Create profile if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO public.profiles (email, coin_balance)
    VALUES (user_email, 500 + amount);
  END IF;
  
  RETURN true;
END;
$$;

-- Function to get or create user profile
CREATE OR REPLACE FUNCTION get_or_create_profile(user_email text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  profile_id uuid;
BEGIN
  SELECT id INTO profile_id FROM public.profiles WHERE email = user_email;
  
  IF NOT FOUND THEN
    INSERT INTO public.profiles (email, is_admin)
    VALUES (user_email, user_email = 'nicolasmoryson2012@gmail.com')
    RETURNING id INTO profile_id;
  END IF;
  
  RETURN profile_id;
END;
$$;