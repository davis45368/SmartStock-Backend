# SmartStock Backend

Microservicio de inventario predictivo con arquitectura hexagonal (Ports & Adapters), TypeScript, Express y Supabase.

## Requisitos

- Node.js 18+
- Proyecto Supabase con tablas creadas (`sql/init.sql`)

## Configuración local

```bash
cd Backend
cp .env.example .env
npm install
```

Variables en `.env`:

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role (solo servidor) |
| `SUPABASE_DB_PASSWORD` | Contraseña de la BD (migración automática de tablas al arrancar) |
| `DATABASE_URL` | Opcional: URI Postgres completa si la conexión directa falla |
| `PORT` | Puerto HTTP (default 5000) |
| `SEED_DEMO_DATA` | `true` (default): inserta 6 productos demo si `products` está vacía al arrancar |

**Tablas:** al arrancar, el backend crea automáticamente `products` y `orders` usando `SUPABASE_URL` + `SUPABASE_DB_PASSWORD` (la contraseña que definiste al crear el proyecto en Supabase → **Settings → Database**). No hace falta ejecutar SQL manualmente.

Al iniciar (`npm run dev`), verás en consola:

```
[SEED] Verificando inventario de demostración...
[SEED] ✓ 6 productos de demostración insertados correctamente.
```

Si ya hay productos, no se duplican. Para volver a cargar demo: vacía la tabla `products` en Supabase y reinicia el backend.

### Usuario demo (login frontend)

Al arrancar también se crea (si no existe) un usuario en **Supabase Auth**:

| Campo | Valor por defecto |
|-------|-------------------|
| Email | `admin@smartstock.com` |
| Contraseña | `SmartStock2024!` |

Personalizable con `DEMO_USER_EMAIL` y `DEMO_USER_PASSWORD` en `.env`. Las credenciales se imprimen en consola al iniciar el backend.

```bash
npm run dev
```

## API

Todas las rutas de inventario requieren `Authorization: Bearer <jwt>` (token de Supabase Auth).

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check (público) |
| GET | `/api/inventory` | Listar productos |
| GET | `/api/inventory/alerts` | Productos en punto de reorden |
| POST | `/api/inventory/update` | Actualizar stock `{ productId, quantitySold }` |
| POST | `/api/inventory/orders` | Despachar orden `{ productId }` |

## Scripts

- `npm run dev` — desarrollo con recarga
- `npm run build` — compilar a `dist/`
- `npm start` — producción
- `npm test` — tests unitarios (Vitest)

## Despliegue en Render

1. Conectar el repositorio en Render Blueprints.
2. El archivo `render.yaml` usa `rootDir: Backend`.
3. Configurar manualmente `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el panel de Render.

## Arquitectura

- **domain/** — entidades, puertos y casos de uso (sin dependencias de framework).
- **infrastructure/** — adaptadores Supabase y notificaciones.
- **presentation/** — controllers, routers y middlewares HTTP.

Al cambiar de Supabase a otra base de datos, solo se modifican adaptadores en `infrastructure/` y el wiring en `app.ts`; el dominio permanece intacto (DIP).
