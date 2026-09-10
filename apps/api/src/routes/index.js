import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import subscriptionsRouter from './ecommerce/subscriptions.js';
import productsRouter from './ecommerce/products.js';
import briefingsRouter from './briefings.js';
import adminConsultoriaOrdersRouter from './admin-consultoria-orders.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import { listPlans } from '../api/ecommerce-subscriptions.js';
import { listOneTimeProducts } from '../api/ecommerce-products.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.get('/ecommerce/plans', async (req, res) => {
        const plans = await listPlans();

        return res.json({ plans });
    });
    router.get('/ecommerce/products', async (req, res) => {
        const products = await listOneTimeProducts();

        return res.json({ products });
    });
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/ecommerce/subscriptions', authMiddleware, subscriptionsRouter);
    router.use('/ecommerce/products', authMiddleware, productsRouter);
    router.use('/admin/briefings', adminMiddleware, briefingsRouter);
    router.use('/admin/consultoria-orders', adminMiddleware, adminConsultoriaOrdersRouter);

    return router;
};
