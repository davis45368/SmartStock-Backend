import { Order, OrderStatus } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/ports/IOrderRepository';
import { supabase } from '../../config/supabase';

interface OrderRow {
  id: string;
  product_id: string;
  quantity_ordered: number;
  status: string;
  supplier: string;
  created_at: string;
}

export class SupabaseOrderRepository implements IOrderRepository {
  private mapRowToOrder(row: OrderRow): Order {
    return new Order(
      row.id,
      row.product_id,
      row.quantity_ordered,
      row.status as OrderStatus,
      row.supplier,
      new Date(row.created_at)
    );
  }

  public async save(order: Order): Promise<void> {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      product_id: order.productId,
      quantity_ordered: order.quantityOrdered,
      status: order.status,
      supplier: order.supplier,
      created_at: order.createdAt.toISOString(),
    });

    if (error) {
      throw new Error(`Error al guardar orden en Supabase: ${error.message}`);
    }
  }

  public async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapRowToOrder(data as OrderRow);
  }
}
