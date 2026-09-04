import { Router } from 'express';
import { pocketbaseClient } from '../utils/pocketbaseClient.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 50;
        const status = req.query.status;
        const filter = status ? `status = "${status}"` : '';

        const result = await pocketbaseClient.collection('briefings').getList(page, perPage, {
            sort: '-created',
            ...(filter && { filter }),
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['aguardando', 'em_desenvolvimento', 'entregue'];

    if (!valid.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    try {
        const record = await pocketbaseClient.collection('briefings').update(id, { status });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
