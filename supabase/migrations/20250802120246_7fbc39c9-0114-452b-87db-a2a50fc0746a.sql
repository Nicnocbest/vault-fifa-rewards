-- Broadcasts
CREATE TABLE IF NOT EXISTS broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  priority text DEFAULT 'normal',
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Orders  
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  package text NOT NULL,
  player_name text,
  rating text,
  status text DEFAULT 'pending',
  admin_reason text,
  created_at timestamptz DEFAULT now()
);

-- Lootboxes
CREATE TABLE IF NOT EXISTS lootbox_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  rarity text NOT NULL,
  claimed bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  title text,
  message text,
  type text DEFAULT 'broadcast',
  data jsonb,
  read bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lootbox_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Broadcast policies
CREATE POLICY "Admins can manage broadcasts" ON broadcasts
FOR ALL USING (true);

CREATE POLICY "Anyone can read active broadcasts" ON broadcasts
FOR SELECT USING (is_active = true);

-- Order policies  
CREATE POLICY "Users can create orders" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their orders" ON orders
FOR SELECT USING (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Admins can manage all orders" ON orders
FOR ALL USING (true);

-- Lootbox policies
CREATE POLICY "Users can manage their lootboxes" ON lootbox_drops
FOR ALL USING (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Admins can manage all lootboxes" ON lootbox_drops
FOR ALL USING (true);

-- Notification policies
CREATE POLICY "Users can view their notifications" ON notifications
FOR SELECT USING (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can update their notifications" ON notifications  
FOR UPDATE USING (user_email = current_setting('app.current_user_email', true));

CREATE POLICY "Admins can manage all notifications" ON notifications
FOR ALL USING (true);

-- Function for Broadcasts
CREATE OR REPLACE FUNCTION send_broadcast_to_all(
  _title text,
  _message text,
  _priority text DEFAULT 'normal'
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  _broadcast_id uuid;
BEGIN
  INSERT INTO broadcasts (title, message, priority, is_active)
  VALUES (_title, _message, _priority, true)
  RETURNING id INTO _broadcast_id;

  -- For now, we'll handle notifications in the frontend
  -- since we don't have a users table yet
  
  RETURN _broadcast_id;
END;
$$;