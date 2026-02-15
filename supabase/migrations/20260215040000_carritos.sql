
-- Tabla carritos (items del carrito por usuario)
CREATE TABLE public.carritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0) DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, producto_id)
);

ALTER TABLE public.carritos ENABLE ROW LEVEL SECURITY;

-- Usuarios solo pueden ver/modificar su propio carrito (usuario_id = auth.uid())
CREATE POLICY "Users can manage own cart"
  ON public.carritos FOR ALL
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
