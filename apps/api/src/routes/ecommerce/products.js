import { Router } from 'express';
import { createOneTimeCheckoutSession, confirmOneTimeOrder } from '../../api/ecommerce-products.js';

const router = Router();

/**
 * Returns the authenticated user id from the JWT payload on `req.user`.
 * Assumes an auth middleware has already run and rejected unauthenticated requests.
 *
 * @param {import('express').Request & { user?: { sub?: string, id?: string } }} req
 * @returns {string | null}
 */
function getUserIdFromRequest(req) {
	const user = req.user;

	if (!user || typeof user !== 'object') {
		return null;
	}

	const fromSub = typeof user.sub === 'string' ? user.sub.trim() : '';

	if (fromSub) {
		return fromSub;
	}

	const fromId = typeof user.id === 'string' ? user.id.trim() : '';

	return fromId || null;
}

/**
 * Creates a Stripe Checkout session (one-time payment) for the resolved user and returns its URL.
 */
router.post('/checkout', async (req, res) => {
	const { priceId, successUrl, cancelUrl } = req.body;
	const userId = getUserIdFromRequest(req);

	if (!userId) {
		throw new Error('User ID is required');
	}

	if (typeof priceId !== 'string' || priceId.trim() === '' || typeof successUrl !== 'string' || successUrl.trim() === '' || typeof cancelUrl !== 'string' || cancelUrl.trim() === '') {
		throw new Error('Price ID, success URL and cancel URL are required');
	}

	const url = await createOneTimeCheckoutSession({
		userId,
		priceId: priceId.trim(),
		successUrl: successUrl.trim(),
		cancelUrl: cancelUrl.trim(),
	});

	return res.json({ url });
});

/**
 * Confirms a completed one-time Checkout Session for the resolved user and records the order.
 */
router.post('/confirm', async (req, res) => {
	const { sessionId } = req.body;
	const userId = getUserIdFromRequest(req);

	if (!userId) {
		throw new Error('User ID is required');
	}

	if (typeof sessionId !== 'string' || sessionId.trim() === '') {
		throw new Error('Session ID is required');
	}

	const order = await confirmOneTimeOrder({ userId, sessionId: sessionId.trim() });

	return res.json({ order });
});

export default router;
