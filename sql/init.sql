-- Creación de la Tabla Maestra de Inventario Inteligente
-- (El backend también puede crearlas al arrancar si DATABASE_URL está en .env)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    stock_actual INT NOT NULL CHECK (stock_actual >= 0),
    venta_promedio_diaria INT NOT NULL DEFAULT 0,
    lead_time INT NOT NULL DEFAULT 1,
    stock_seguridad INT NOT NULL DEFAULT 0,
    supplier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Órdenes de compra generadas por el algoritmo predictivo
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    supplier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Los datos de demostración se cargan automáticamente al iniciar el backend
-- (ver src/infrastructure/database/seedDemoData.ts) si la tabla está vacía.
-- También puedes insertar manualmente ejecutando el seed desde la app.
