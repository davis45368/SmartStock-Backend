import { Product } from '../entities/Product';
import { IProductRepository } from '../ports/IProductRepository';

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
