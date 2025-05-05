
-- Create a function that safely checks if a user has active access
-- This function will be used to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.has_active_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_access
    WHERE user_id = user_uuid
      AND (access_until IS NULL OR access_until > now())
  );
END;
$$;

-- Add a trigger to automatically create access for new users
CREATE OR REPLACE FUNCTION public.add_default_access_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a record in user_access giving 7 days of access
  INSERT INTO public.user_access (user_id, access_until)
  VALUES (NEW.id, NOW() + INTERVAL '7 days');
  
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'add_default_access_after_signup'
  ) THEN
    CREATE TRIGGER add_default_access_after_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.add_default_access_on_signup();
  END IF;
END
$$;
