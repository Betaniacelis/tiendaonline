# Grace Divine Marketplace

Aplicación web de e-commerce moderna con autenticación, roles de usuario (admin/usuario), gestión de productos con stock, carrito de compras y pagos con PayPal Sandbox.

## 🛍️ Características

- 🛒 **E-commerce completo** con catálogo de productos
- 🔐 **Autenticación segura** con Supabase Auth
- 👥 **Roles de usuario**: Admin y Usuario
- 📦 **CRUD de productos** con gestión de stock
- 🛒 **Carrito de compras** integrado
- 💳 **Pagos con PayPal** Sandbox
- 📱 **Diseño responsive** y moderno
- 🎨 **UI con gradientes** y glassmorphism
- 📊 **Sistema de stock** con validaciones
- 🛡️ **Seguridad** con RLS en Supabase

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui + Tailwind CSS + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Pagos**: PayPal SDK
- **Fonts**: Google Fonts (Inter + Playfair Display)

## 🚀 Desarrollo local

```sh
npm install
npm run dev
```

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y configura:

- `VITE_SUPABASE_URL` - URL del proyecto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Clave anónima (anon key)
- `VITE_PAYPAL_CLIENT_ID` - Client ID de PayPal Sandbox (Developer Dashboard)

## 💳 PayPal Sandbox

1. Crea una app en [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Usa las credenciales Sandbox (Client ID y Secret)
3. En Supabase: añade los secrets `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` en Edge Functions
4. En `.env`: añade `VITE_PAYPAL_CLIENT_ID` con el Client ID (es público)

## 🏗️ Despliegue

```sh
npm run build
```

## 📊 Migraciones

Ejecuta las migraciones en orden:

```sh
npx supabase db push
```

O ejecuta manualmente en Supabase SQL Editor:

```sql
-- 1. Crear tabla productos con stock
ALTER TABLE public.productos ADD COLUMN stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0);

-- 2. Insertar datos de ejemplo
-- (Ejecuta el contenido de supabase/seed_data.sql)
```

## ⚡ Edge Functions

Despliega las funciones PayPal:

```sh
npx supabase functions deploy crear-orden-paypal
npx supabase functions deploy confirmar-pago
```

Configura los secrets: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`

## 📋 Módulos Implementados

- ✅ Login/Register con roles
- ✅ Catálogo de productos con filtros
- ✅ Gestión de carrito
- ✅ Perfil de usuario
- ✅ Panel de administración
- ✅ Historial de compras
- ✅ CRUD de productos con stock
- ✅ Validaciones de stock
- ✅ Pagos con PayPal

## 🎨 UI/UX

- Diseño moderno con gradientes
- Glassmorphism effects
- Tipografía Inter + Playfair Display
- Responsive design
- Animaciones y transiciones
- Toast notifications
- Loading states

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- Validaciones de inputs
- Sanitización de datos
- Protección contra CSRF
- Autenticación segura con JWT
