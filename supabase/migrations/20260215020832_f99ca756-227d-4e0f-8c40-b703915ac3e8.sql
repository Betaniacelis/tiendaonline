
-- Make insert policies more restrictive: only service_role (trigger) can insert
DROP POLICY "Allow insert for trigger" ON public.profiles;
DROP POLICY "Allow insert for trigger" ON public.user_roles;

-- Profiles: only allow insert where id matches auth.uid()
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles: only allow insert where user_id matches auth.uid()
CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
