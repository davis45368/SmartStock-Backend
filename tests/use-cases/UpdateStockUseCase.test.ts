import { describe, expect, it } from 'vitest';
import { Product } from '../../src/domain/entities/Product';
import { INotificationHelper } from '../../src/domain/ports/INotificationHelper';
import { IProductRepository } from '../../src/domain/ports/IProductRepository';
import { UpdateStockUseCase } from '../../src/domain/use-cases/UpdateStockUseCase';

class InMemoryProductRepository implements IProductRepository {
  constructor(private products: Map<string, Product>) {}

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async update(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }
}

class FakeNotificationHelper implements INotificationHelper {
  public alerts: Array<{ message: string; contact: string }> = [];

  async sendAlert(message: string, contact: string): Promise<boolean> {
    this.alerts.push({ message, contact });
    return true;
  }
}

describe('UpdateStockUseCase', () => {
  it('envía alerta cuando el stock cruza el punto de reorden', async () => {
    const product = new Product(
      'prod-1',
      'Arroz Integral 1kg',
      12,
      8,
      2,
      10,
      'Molinos del Campo SAS'
    );

    const repository = new InMemoryProductRepository(
      new Map([[product.id, product]])
    );
    const notifier = new FakeNotificationHelper();
    const useCase = new UpdateStockUseCase(repository, notifier);

    await useCase.execute('prod-1', 1);

    expect(notifier.alerts).toHaveLength(1);
    expect(notifier.alerts[0].contact).toBe('Molinos del Campo SAS');
    expect(notifier.alerts[0].message).toContain('ALERTA CRÍTICA SMARTSTOCK');
  });

  it('no envía alerta si el stock sigue por encima del punto de reorden', async () => {
    const product = new Product(
      'prod-2',
      'Aceite de Girasol 1L',
      100,
      15,
      4,
      25,
      'Proveedora Alimentos Mayorista'
    );

    const repository = new InMemoryProductRepository(
      new Map([[product.id, product]])
    );
    const notifier = new FakeNotificationHelper();
    const useCase = new UpdateStockUseCase(repository, notifier);

    await useCase.execute('prod-2', 5);

    expect(notifier.alerts).toHaveLength(0);
  });

  it('lanza error si el producto no existe', async () => {
    const repository = new InMemoryProductRepository(new Map());
    const notifier = new FakeNotificationHelper();
    const useCase = new UpdateStockUseCase(repository, notifier);

    await expect(useCase.execute('missing', 1)).rejects.toThrow(
      'no localizado'
    );
    expect(notifier.alerts).toHaveLength(0);
  });
});
