import { randomUUID } from 'crypto';
import { Order } from '../entities/Order';
import { INotificationHelper } from '../ports/INotificationHelper';
import { IOrderRepository } from '../ports/IOrderRepository';
import { IProductRepository } from '../ports/IProductRepository';

export class DispatchPurchaseOrderUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly notificationHelper: INotificationHelper
  ) {}

  public async execute(productId: string): Promise<Order> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Producto con ID ${productId} no localizado.`);
    }

    if (!product.requiresReorder()) {
      throw new Error(
        `El producto ${product.name} no requiere reorden en este momento.`
      );
    }

    const quantityOrdered = product.suggestedOrderQuantity();
    const order = Order.createPending(
      randomUUID(),
      product.id,
      quantityOrdered,
      product.supplier
    );

    await this.orderRepository.save(order);

    const message = `ORDEN DE COMPRA SMARTSTOCK: Producto ${product.name}, cantidad sugerida: ${quantityOrdered} unidades. Estado: PENDING.`;
    await this.notificationHelper.sendAlert(message, product.supplier);

    return order;
  }
}
