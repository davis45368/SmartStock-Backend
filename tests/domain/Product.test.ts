import { describe, expect, it } from 'vitest';
import { Product } from '../../src/domain/entities/Product';

describe('Product', () => {
  const createProduct = (stockActual: number) =>
    new Product(
      'prod-1',
      'Leche Entera 1L',
      stockActual,
      10,
      3,
      15,
      'Distribuidora Lácteos Central'
    );

  it('requiresReorder cuando stock está en o bajo el punto de reorden', () => {
    const product = createProduct(46);
    expect(product.requiresReorder()).toBe(false);

    const critical = createProduct(45);
    expect(critical.requiresReorder()).toBe(true);
  });

  it('calcula suggestedOrderQuantity correctamente', () => {
    const product = createProduct(20);
    expect(product.suggestedOrderQuantity()).toBe(25);
  });

  it('deductStock reduce inventario y no permite cantidad inválida', () => {
    const product = createProduct(50);
    product.deductStock(10);
    expect(product.stockActual).toBe(40);

    expect(() => product.deductStock(0)).toThrow(
      'La cantidad a descontar debe ser mayor a cero.'
    );
  });

  it('deductStock no baja de cero', () => {
    const product = createProduct(5);
    product.deductStock(100);
    expect(product.stockActual).toBe(0);
  });
});
