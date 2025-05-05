
-- Create an RPC function for has_active_access to make it accessible from the client
CREATE OR REPLACE FUNCTION public.has_active_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function is security definer so it bypasses RLS
  RETURN EXISTS (
    SELECT 1 FROM public.user_access
    WHERE user_id = user_uuid
      AND (access_until IS NULL OR access_until > now())
  );
END;
$$;
