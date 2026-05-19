import { Order } from '../../domain/entities/Order';
import { Product } from '../../domain/entities/Product';

export function toProductDto(product: Product) {
  return {
    id: product.id,
    name: product.name,
    stockActual: product.stockActual,
    ventaPromedioDiaria: product.ventaPromedioDiaria,
    leadTime: product.leadTime,
    stockSeguridad: product.stockSeguridad,
    supplier: product.supplier,
    requiresReorder: product.requiresReorder(),
    suggestedOrderQuantity: product.suggestedOrderQuantity(),
  };
}

export function toOrderDto(order: Order) {
  return {
    id: order.id,
    productId: order.productId,
    quantityOrdered: order.quantityOrdered,
    status: order.status,
    supplier: order.supplier,
    createdAt: order.createdAt.toISOString(),
  };
}
