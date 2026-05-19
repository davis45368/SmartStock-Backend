import { Product } from '../entities/Product';
import { IProductRepository } from '../ports/IProductRepository';

export class GetCriticalAlertsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async execute(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products.filter((product) => product.requiresReorder());
  }
}
