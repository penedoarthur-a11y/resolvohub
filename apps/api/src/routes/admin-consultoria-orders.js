import { Router } from 'express';
import { pocketbaseClient } from '../utils/pocketbaseClient.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 50;

        const result = await pocketbaseClient.collection('consultoria_orders').getList(page, perPage, {
            sort: '-created',
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
