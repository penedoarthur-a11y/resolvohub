import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import subscriptionsRouter from './ecommerce/subscriptions.js';
import briefingsRouter from './briefings.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import { listPlans } from '../api/ecommerce-subscriptions.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.get('/ecommerce/plans', async (req, res) => {
        const plans = await listPlans();

        return res.json({ plans });
    });
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/ecommerce/subscriptions', authMiddleware, subscriptionsRouter);
    router.use('/admin/briefings', adminMiddleware, briefingsRouter);

    return router;
};
