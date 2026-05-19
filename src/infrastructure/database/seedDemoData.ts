import { supabase } from '../config/supabase';

export interface SeedProductRow {
  id: string;
  name: string;
  stock_actual: number;
  venta_promedio_diaria: number;
  lead_time: number;
  stock_seguridad: number;
  supplier: string;
}

/** Datos alineados con los mockups del MVP académico (3 críticos + 3 óptimos). */
export const DEMO_PRODUCTS: SeedProductRow[] = [
  {
    id: 'a1000001-0001-4001-8001-000000000001',
    name: 'Leche Entera 1L',
    stock_actual: 12,
    venta_promedio_diaria: 15,
    lead_time: 3,
    stock_seguridad: 15,
    supplier: 'Distribuidora Lácteos Central',
  },
  {
    id: 'a1000001-0001-4001-8001-000000000002',
    name: 'Pan de Molde Integral',
    stock_actual: 8,
    venta_promedio_diaria: 10,
    lead_time: 2,
    stock_seguridad: 10,
    supplier: 'Panificadora Central',
  },
  {
    id: 'a1000001-0001-4001-8001-000000000003',
    name: 'Yogur Natural 500g',
    stock_actual: 19,
    venta_promedio_diaria: 18,
    lead_time: 3,
    stock_seguridad: 15,
    supplier: 'Lácteos del Norte S.A.',
  },
  {
    id: 'a1000001-0001-4001-8001-000000000004',
    name: 'Arroz Integral 1kg',
    stock_actual: 85,
    venta_promedio_diaria: 8,
    lead_time: 2,
    stock_seguridad: 10,
    supplier: 'Molinos del Campo SAS',
  },
  {
    id: 'a1000001-0001-4001-8001-000000000005',
    name: 'Aceite de Girasol 1L',
    stock_actual: 110,
    venta_promedio_diaria: 12,
    lead_time: 4,
    stock_seguridad: 25,
    supplier: 'Proveedora Alimentos Mayorista',
  },
  {
    id: 'a1000001-0001-4001-8001-000000000006',
    name: 'Pasta Espagueti 500g',
    stock_actual: 64,
    venta_promedio_diaria: 9,
    lead_time: 2,
    stock_seguridad: 10,
    supplier: 'Molinos del Campo SAS',
  },
];

function isSeedEnabled(): boolean {
  return process.env.SEED_DEMO_DATA !== 'false';
}

export async function seedDemoDataIfEmpty(): Promise<void> {
  if (!isSeedEnabled()) {
    console.log('[SEED] Carga de datos demo deshabilitada (SEED_DEMO_DATA=false).');
    return;
  }

  console.log('[SEED] Verificando inventario de demostración...');

  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error(
      `[SEED] Error al consultar productos: ${countError.message}`
    );
    if (countError.message.includes('schema cache') || countError.code === 'PGRST205') {
      console.error(
        '[SEED] La tabla public.products no existe. Añade DATABASE_URL al .env y reinicia,'
      );
      console.error(
        '[SEED] o ejecuta Backend/sql/init.sql en Supabase → SQL Editor.'
      );
    }
    return;
  }

  if (count !== null && count > 0) {
    console.log(
      `[SEED] Ya existen ${count} producto(s). Se omite la carga demo.`
    );
    return;
  }

  const { error: insertError } = await supabase
    .from('products')
    .insert(DEMO_PRODUCTS);

  if (insertError) {
    console.error(`[SEED] Error al insertar productos demo: ${insertError.message}`);
    if (insertError.message.includes('schema cache') || insertError.code === 'PGRST205') {
      console.error('[SEED] Configura DATABASE_URL en Backend/.env y reinicia el servidor.');
    }
    return;
  }

  console.log(
    `[SEED] ✓ ${DEMO_PRODUCTS.length} productos de demostración insertados correctamente.`
  );
  console.log(
    '[SEED]   · 3 en punto de reorden (críticos) · 3 con stock óptimo'
  );
}
