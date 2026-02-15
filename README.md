# Secure User Hub

Aplicación web con autenticación, roles de usuario (admin/usuario), gestión de productos, carrito de compras y pagos con PayPal Sandbox.

## Tecnologías

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth, base de datos, Edge Functions)
- PayPal Sandbox

## Desarrollo local

```sh
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

- `VITE_SUPABASE_URL` - URL del proyecto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Clave anónima (anon key)
- `VITE_PAYPAL_CLIENT_ID` - Client ID de PayPal Sandbox (Developer Dashboard)

## PayPal Sandbox

1. Crea una app en [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Usa las credenciales Sandbox (Client ID y Secret)
3. En Supabase: añade los secrets `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` en Edge Functions
4. En `.env`: añade `VITE_PAYPAL_CLIENT_ID` con el Client ID (es público)

## Despliegue

```sh
npm run build
```

## Migraciones

Ejecuta las migraciones en orden:

```sh
npx supabase db push
```

## Edge Functions

Despliega las funciones PayPal:

```sh
npx supabase functions deploy crear-orden-paypal
npx supabase functions deploy confirmar-pago
```

Configura los secrets: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
