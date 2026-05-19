import { NextFunction, Request, Response } from 'express';
import { DispatchPurchaseOrderUseCase } from '../../domain/use-cases/DispatchPurchaseOrderUseCase';
import { GetCriticalAlertsUseCase } from '../../domain/use-cases/GetCriticalAlertsUseCase';
import { ListProductsUseCase } from '../../domain/use-cases/ListProductsUseCase';
import { UpdateStockUseCase } from '../../domain/use-cases/UpdateStockUseCase';
import { toOrderDto, toProductDto } from '../dto/mappers';

export class ProductController {
  constructor(
    private readonly updateStockUseCase: UpdateStockUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getCriticalAlertsUseCase: GetCriticalAlertsUseCase,
    private readonly dispatchPurchaseOrderUseCase: DispatchPurchaseOrderUseCase
  ) {}

  public async listProducts(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await this.listProductsUseCase.execute();
      res.status(200).json({
        status: 'success',
        data: products.map(toProductDto),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCriticalAlerts(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const alerts = await this.getCriticalAlertsUseCase.execute();
      res.status(200).json({
        status: 'success',
        data: alerts.map(toProductDto),
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateStock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId, quantitySold } = req.body;

      if (!productId || typeof quantitySold !== 'number') {
        res.status(400).json({
          error: "Parámetros inválidos. Ingrese 'productId' y 'quantitySold'.",
        });
        return;
      }

      const updatedProduct = await this.updateStockUseCase.execute(
        productId,
        quantitySold
      );

      res.status(200).json({
        status: 'success',
        message: 'Inventario procesado por algoritmo predictivo',
        data: toProductDto(updatedProduct),
      });
    } catch (error) {
      next(error);
    }
  }

  public async dispatchOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.body;

      if (!productId) {
        res.status(400).json({
          error: "Parámetro inválido. Ingrese 'productId'.",
        });
        return;
      }

      const order = await this.dispatchPurchaseOrderUseCase.execute(productId);

      res.status(201).json({
        status: 'success',
        message: 'Orden de compra despachada al proveedor',
        data: toOrderDto(order),
      });
    } catch (error) {
      next(error);
    }
  }
}
