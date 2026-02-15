
-- Tabla ordenes
CREATE TABLE public.ordenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paypal_order_id TEXT,
  total DECIMAL(12, 2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'fallida')),
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla orden_items
CREATE TABLE public.orden_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES public.ordenes(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12, 2) NOT NULL
);

ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orden_items ENABLE ROW LEVEL SECURITY;

-- Usuarios solo ven sus propias órdenes
CREATE POLICY "Users can view own ordenes"
  ON public.ordenes FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Inserts solo via service_role (Edge Functions) - sin policy = denegado para authenticated

-- Usuarios pueden ver items de sus órdenes (via join)
CREATE POLICY "Users can view own orden_items"
  ON public.orden_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ordenes
      WHERE ordenes.id = orden_items.orden_id
      AND ordenes.usuario_id = auth.uid()
    )
  );

-- Inserts solo via service_role
