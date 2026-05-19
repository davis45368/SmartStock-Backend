export type OrderStatus = 'PENDING' | 'SENT' | 'RECEIVED' | 'CANCELLED';

export class Order {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantityOrdered: number,
    public readonly status: OrderStatus,
    public readonly supplier: string,
    public readonly createdAt: Date
  ) {}

  static createPending(
    id: string,
    productId: string,
    quantityOrdered: number,
    supplier: string
  ): Order {
    return new Order(
      id,
      productId,
      quantityOrdered,
      'PENDING',
      supplier,
      new Date()
    );
  }
}
