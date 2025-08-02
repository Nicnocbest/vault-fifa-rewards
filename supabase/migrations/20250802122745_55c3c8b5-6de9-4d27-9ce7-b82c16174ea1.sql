-- Add realtime to existing tables
ALTER TABLE public.maintenance_mode REPLICA IDENTITY FULL;
ALTER TABLE public.broadcasts REPLICA IDENTITY FULL;

-- Add them to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_mode;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcasts;