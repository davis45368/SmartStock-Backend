import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/ports/IProductRepository';
import { supabase } from '../../config/supabase';

interface ProductRow {
  id: string;
  name: string;
  stock_actual: number;
  venta_promedio_diaria: number;
  lead_time: number;
  stock_seguridad: number;
  supplier: string;
}

export class SupabaseProductRepository implements IProductRepository {
  private mapRowToProduct(row: ProductRow): Product {
    return new Product(
      row.id,
      row.name,
      row.stock_actual,
      row.venta_promedio_diaria,
      row.lead_time,
      row.stock_seguridad,
      row.supplier
    );
  }

  public async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapRowToProduct(data as ProductRow);
  }

  public async findAll(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*');

    if (error || !data) return [];

    return (data as ProductRow[]).map((row) => this.mapRowToProduct(row));
  }

  public async update(product: Product): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock_actual: product.stockActual })
      .eq('id', product.id);

    if (error) {
      throw new Error(
        `Error al sincronizar datos en Supabase: ${error.message}`
      );
    }
  }
}
