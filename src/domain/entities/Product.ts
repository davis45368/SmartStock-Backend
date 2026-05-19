export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public stockActual: number,
    public readonly ventaPromedioDiaria: number,
    public readonly leadTime: number,
    public readonly stockSeguridad: number,
    public readonly supplier: string
  ) {}

  public requiresReorder(): boolean {
    const reorderPoint =
      this.ventaPromedioDiaria * this.leadTime + this.stockSeguridad;
    return this.stockActual <= reorderPoint;
  }

  public suggestedOrderQuantity(): number {
    const reorderPoint =
      this.ventaPromedioDiaria * this.leadTime + this.stockSeguridad;
    return Math.max(1, reorderPoint - this.stockActual);
  }

  public deductStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a descontar debe ser mayor a cero.');
    }
    this.stockActual = Math.max(0, this.stockActual - quantity);
  }
}
