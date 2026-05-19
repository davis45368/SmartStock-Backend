import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

export function createProductRouter(productController: ProductController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', (req, res, next) =>
    productController.listProducts(req, res, next)
  );
  router.get('/alerts', (req, res, next) =>
    productController.getCriticalAlerts(req, res, next)
  );
  router.post('/update', (req, res, next) =>
    productController.updateStock(req, res, next)
  );
  router.post('/orders', (req, res, next) =>
    productController.dispatchOrder(req, res, next)
  );

  return router;
}
