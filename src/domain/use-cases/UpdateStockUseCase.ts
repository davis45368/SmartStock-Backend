import { Product } from '../entities/Product';
import { INotificationHelper } from '../ports/INotificationHelper';
import { IProductRepository } from '../ports/IProductRepository';

export class UpdateStockUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly notificationHelper: INotificationHelper
  ) {}

  public async execute(
    productId: string,
    quantitySold: number
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Producto con ID ${productId} no localizado.`);
    }

    product.deductStock(quantitySold);
    await this.productRepository.update(product);

    if (product.requiresReorder()) {
      const warningMessage = `ALERTA CRÍTICA SMARTSTOCK: El producto ${product.name} ha cruzado su punto de reorden. Stock actual: ${product.stockActual} unidades.`;
      await this.notificationHelper.sendAlert(warningMessage, product.supplier);
    }

    return product;
  }
}
