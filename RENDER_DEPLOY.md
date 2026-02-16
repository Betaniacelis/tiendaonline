# Grace Divine Marketplace

## 🚀 Despliegue en Render

### 1. Preparar el Proyecto

El proyecto ya está configurado para producción con:

- ✅ **Build command**: `npm run build`
- ✅ **Start command**: `npm start`
- ✅ **Publish directory**: `dist`

### 2. Variables de Entorno en Render

Configura estas variables en tu dashboard de Render:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# PayPal
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### 3. Pasos para Desplegar

#### Opción A: Web Service (Recomendado)

1. **Ve a [Render Dashboard](https://dashboard.render.com/)**
2. **"New +" → "Web Service"**
3. **Conecta tu repositorio**: `https://github.com/Betaniacelis/tiendaonline`
4. **Configura**:
   - **Name**: `grace-divine-marketplace`
   - **Environment**: `Node`
   - **Region**: Más cercana a tus usuarios
   - **Branch**: `main`
   - **Root Directory**: `./`
   - **Runtime**: `Node 18.x`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Publish Directory**: `dist`

5. **Advanced Settings**:
   - **Auto-Deploy**: ✅ Enabled
   - **Health Check Path**: `/`

#### Opción B: Static Site

1. **"New +" → "Static Site"**
2. **Repositorio**: `https://github.com/Betaniacelis/tiendaonline`
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18`

### 4. Configurar Supabase para Producción

1. **Ve a tu proyecto Supabase**
2. **Settings → API**
3. **Añade el dominio de Render** a:
   - **Site URL**: `https://tu-app.onrender.com`
   - **Redirect URLs**: `https://tu-app.onrender.com/**`

### 5. Configurar PayPal para Producción

1. **Ve a [PayPal Developer Dashboard](https://developer.paypal.com/)**
2. **Crea una aplicación Live** (no Sandbox)
3. **Obén las credenciales Live**
4. **Actualiza las variables en Render**:
   ```bash
   VITE_PAYPAL_CLIENT_ID=your_paypal_live_client_id
   ```

### 6. Edge Functions en Supabase

Despliega las funciones PayPal:

```bash
npx supabase functions deploy crear-orden-paypal
npx supabase functions deploy confirmar-pago
```

Actualiza los secrets en Supabase:
- `PAYPAL_CLIENT_ID` (Live)
- `PAYPAL_CLIENT_SECRET` (Live)

### 7. Base de Datos

Ejecuta las migraciones:

```sql
-- Añadir columna stock si no existe
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0);

-- Insertar datos de ejemplo
-- (Ejecuta el contenido de supabase/seed_data.sql)
```

### 8. Verificación del Despliegue

Una vez desplegado:

1. **Visita**: `https://tu-app.onrender.com`
2. **Verifica**:
   - ✅ La página carga correctamente
   - ✅ El login/register funciona
   - ✅ Los productos se muestran
   - ✅ El carrito funciona
   - ✅ Los pagos con PayPal funcionan

### 9. Dominio Personalizado (Opcional)

1. **En Render Dashboard → Settings → Custom Domains**
2. **Añade tu dominio**: `tudominio.com`
3. **Configura DNS**:
   ```
   CNAME -> tu-app.onrender.com
   ```

### 10. Monitoreo y Logs

- **Logs**: Render Dashboard → Logs
- **Métricas**: Render Dashboard → Metrics
- **Errores**: Revisa la pestaña "Events"

## 🔧 Troubleshooting Común

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Render

### Error: "Supabase connection failed"
- Verifica las variables de entorno
- Confirma que la URL y clave sean correctas

### Error: "PayPal not working"
- Verifica las credenciales de PayPal
- Confirma que los dominios estén configurados

## 📋 Checklist Final

- [ ] Repositorio conectado a Render
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Dominio de Render en Supabase
- [ ] PayPal configurado para producción
- [ ] Base de datos migrada
- [ ] Edge Functions desplegadas
- [ ] Testing completo
- [ ] Dominio personalizado (opcional)

## 🎯 ¡Tu tienda estará en línea!

Una vez completados estos pasos, tu Grace Divine Marketplace estará funcionando en producción con:
- 🛒 E-commerce completo
- 🔐 Autenticación segura
- 💳 Pagos funcionando
- 📱 Diseño responsive
- 🛡️ Seguridad implementada

**¡Felicidades! Tu tienda online estará lista para recibir clientes!** 🎉
