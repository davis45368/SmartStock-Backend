import { Product } from '../entities/Product';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<void>;
}
