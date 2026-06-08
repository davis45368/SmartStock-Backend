import cors from 'cors';
import express from 'express';
import { DispatchPurchaseOrderUseCase } from './domain/use-cases/DispatchPurchaseOrderUseCase';
import { GetCriticalAlertsUseCase } from './domain/use-cases/GetCriticalAlertsUseCase';
import { ListProductsUseCase } from './domain/use-cases/ListProductsUseCase';
import { UpdateStockUseCase } from './domain/use-cases/UpdateStockUseCase';
import { SupabaseOrderRepository } from './infrastructure/adapters/database/SupabaseOrderRepository';
import { SupabaseProductRepository } from './infrastructure/adapters/database/SupabaseProductRepository';
import { WhatsAppNotificationHelper } from './infrastructure/adapters/external/WhatsAppNotificationHelper';
import { ProductController } from './presentation/controllers/ProductController';
import { errorHandler } from './presentation/middlewares/ErrorHandler';
import { createProductRouter } from './presentation/routers/ProductRouter';
import { renderApiDocumentationPage } from './presentation/views/apiDocumentationPage';
import { ensureDatabaseSchema } from './infrastructure/database/ensureDatabaseSchema';
import { seedDemoAuthUser } from './infrastructure/database/seedDemoAuth';
import { seedDemoDataIfEmpty } from './infrastructure/database/seedDemoData';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.type('html').send(renderApiDocumentationPage());
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const productRepository = new SupabaseProductRepository();
const orderRepository = new SupabaseOrderRepository();
const notificationHelper = new WhatsAppNotificationHelper();

const updateStockUseCase = new UpdateStockUseCase(
  productRepository,
  notificationHelper
);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const getCriticalAlertsUseCase = new GetCriticalAlertsUseCase(
  productRepository
);
const dispatchPurchaseOrderUseCase = new DispatchPurchaseOrderUseCase(
  productRepository,
  orderRepository,
  notificationHelper
);

const productController = new ProductController(
  updateStockUseCase,
  listProductsUseCase,
  getCriticalAlertsUseCase,
  dispatchPurchaseOrderUseCase
);

app.use('/api/inventory', createProductRouter(productController));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
  await ensureDatabaseSchema();
  await seedDemoAuthUser();
  await seedDemoDataIfEmpty();

  const server = app.listen(PORT, () => {
    console.log(
      `Ecosistema SmartStock corriendo de forma robusta sobre puerto ${PORT}`
    );
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `[BOOTSTRAP] El puerto ${PORT} ya está en uso. Cierra la otra instancia:`
      );
      console.error(
        `  PowerShell: Get-NetTCPConnection -LocalPort ${PORT} | Select OwningProcess`
      );
      console.error('  Luego: Stop-Process -Id <PID> -Force');
      process.exit(1);
    }
    throw error;
  });
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('[BOOTSTRAP] Error al iniciar el servicio:', error);
    process.exit(1);
  });
}

export { app };
