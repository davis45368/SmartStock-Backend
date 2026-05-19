import { describe, expect, it } from 'vitest';
import { DEMO_PRODUCTS } from '../../src/infrastructure/database/seedDemoData';

function isCritical(
  stock: number,
  venta: number,
  leadTime: number,
  seguridad: number
): boolean {
  const reorderPoint = venta * leadTime + seguridad;
  return stock <= reorderPoint;
}

describe('DEMO_PRODUCTS seed', () => {
  it('incluye 6 productos de demostración', () => {
    expect(DEMO_PRODUCTS).toHaveLength(6);
  });

  it('tiene 3 productos críticos y 3 óptimos para el MVP', () => {
    const critical = DEMO_PRODUCTS.filter((p) =>
      isCritical(
        p.stock_actual,
        p.venta_promedio_diaria,
        p.lead_time,
        p.stock_seguridad
      )
    );
    expect(critical).toHaveLength(3);
    expect(DEMO_PRODUCTS.length - critical.length).toBe(3);
  });

  it('usa IDs fijos para referencia estable', () => {
    const ids = DEMO_PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(6);
  });
});
