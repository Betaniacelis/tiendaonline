
-- Tabla productos
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  precio DECIMAL(12, 2) NOT NULL CHECK (precio > 0),
  descripcion TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- SELECT: usuarios autenticados pueden listar y ver productos
CREATE POLICY "Authenticated users can view productos"
  ON public.productos FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: solo admins pueden crear productos
CREATE POLICY "Only admins can insert productos"
  ON public.productos FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
