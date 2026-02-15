-- ========================================
-- MIGRACIÓN MAESTRA - SECURE USER HUB
-- ========================================
-- Esta migración combina todas las tablas y configuraciones necesarias
-- para la aplicación completa de e-commerce con autenticación

-- 1. TIPOS ENUM
-- ========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'usuario');

-- 2. TABLAS DE AUTENTICACIÓN Y USUARIOS
-- ========================================

-- Perfiles de usuarios
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Roles de usuarios
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'usuario',
  UNIQUE (user_id, role)
);

-- 3. TABLAS DE PRODUCTOS
-- ========================================

-- Productos del catálogo
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  precio DECIMAL(12, 2) NOT NULL CHECK (precio > 0),
  descripcion TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. TABLAS DE CARRITO
-- ========================================

-- Items en el carrito de compras
CREATE TABLE public.carritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0) DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, producto_id)
);

-- 5. TABLAS DE ÓRDENES Y PAGOS
-- ========================================

-- Órdenes de compra
CREATE TABLE public.ordenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paypal_order_id TEXT,
  total DECIMAL(12, 2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'fallida')),
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Items de cada orden
CREATE TABLE public.orden_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES public.ordenes(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12, 2) NOT NULL
);

-- 6. HABILITAR ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orden_items ENABLE ROW LEVEL SECURITY;

-- 7. FUNCIONES DE SEGURIDAD
-- ========================================

-- Función para verificar roles (evita recursión en RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'usuario'));
  
  RETURN NEW;
END;
$$;

-- 8. POLICIES DE SEGURIDAD (RLS)
-- ========================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Productos policies
CREATE POLICY "Authenticated users can view productos"
  ON public.productos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert productos"
  ON public.productos FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Carritos policies
CREATE POLICY "Users can manage own cart"
  ON public.carritos FOR ALL
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Ordenes policies
CREATE POLICY "Users can view own ordenes"
  ON public.ordenes FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Orden items policies
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

-- 9. TRIGGERS
-- ========================================

-- Trigger para crear perfil y rol al registrar usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 10. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

CREATE INDEX idx_profiles_id ON public.profiles(id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_productos_codigo ON public.productos(codigo);
CREATE INDEX idx_carritos_usuario_id ON public.carritos(usuario_id);
CREATE INDEX idx_carritos_producto_id ON public.carritos(producto_id);
CREATE INDEX idx_ordenes_usuario_id ON public.ordenes(usuario_id);
CREATE INDEX idx_ordenes_paypal_order_id ON public.ordenes(paypal_order_id);
CREATE INDEX idx_orden_items_orden_id ON public.orden_items(orden_id);
CREATE INDEX idx_orden_items_producto_id ON public.orden_items(producto_id);

-- ========================================
-- MIGRACIÓN COMPLETA - LISTA PARA USAR
-- ========================================
