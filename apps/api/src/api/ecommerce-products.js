import stripeClient from '../utils/stripe.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';
import { findOrCreateStripeCustomer, getStoredStripeCustomerId, formatBrl } from './ecommerce-subscriptions.js';

/**
 * @typedef {object} EcommerceOneTimeProduct
 * @property {string} id - Stripe product id.
 * @property {string} priceId - Stripe price id (one-time, non-recurring).
 * @property {string} title - Product name.
 * @property {string} description - Product description.
 * @property {number} price_in_cents - Price in cents.
 * @property {string} currency - Price currency.
 * @property {string} price_formatted - Formatted BRL price.
 */

/**
 * Lists active one-time (non-recurring) Stripe products — e.g. avulso services like
 * the Consultoria. Separate from {@link listPlans} in ecommerce-subscriptions.js,
 * which only lists recurring subscription prices.
 *
 * @returns {Promise<EcommerceOneTimeProduct[]>}
 */
export async function listOneTimeProducts() {
	const prices = await stripeClient.prices.list({
		active: true,
		type: 'one_time',
		expand: ['data.product'],
		limit: 100,
	});

	return prices.data
		.filter((price) => price.product && price.product.active)
		.map((price) => ({
			id: price.product.id,
			priceId: price.id,
			title: price.product.name,
			description: price.product.description ?? '',
			order: Number(price.product.metadata?.order ?? 0),
			price_in_cents: price.unit_amount,
			currency: price.currency,
			price_formatted: formatBrl(price.unit_amount),
		}))
		.sort((a, b) => a.order - b.order);
}

/**
 * Create a Stripe Checkout Session for a one-time (non-subscription) purchase.
 *
 * @param {{ userId: string, priceId: string, successUrl: string, cancelUrl: string }} params
 * @returns {Promise<string>} Checkout URL to redirect the customer to.
 */
export async function createOneTimeCheckoutSession({ userId, priceId, successUrl, cancelUrl }) {
	const customerId = await findOrCreateStripeCustomer({ userId });

	const session = await stripeClient.checkout.sessions.create({
		mode: 'payment',
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
	});

	return session.url;
}

/**
 * Confirms a completed Checkout Session belongs to `userId` and records the order in
 * PocketBase (`consultoria_orders`) so an admin gets notified (via the collection's
 * `consultoria-orders-notifier` hook) and can follow up manually — there is no
 * ongoing subscription state to poll for a one-time purchase, so this confirm step
 * (called from the success page) is what persists the order, instead of a webhook.
 * Idempotent: re-confirming the same session returns the existing record.
 *
 * @param {{ userId: string, sessionId: string }} params
 * @returns {Promise<{ id: string, productTitle: string, amountFormatted: string }>}
 */
export async function confirmOneTimeOrder({ userId, sessionId }) {
	const storedCustomerId = await getStoredStripeCustomerId(userId);
	const session = await stripeClient.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items.data.price.product'],
	});

	if (session.payment_status !== 'paid' || session.customer !== storedCustomerId) {
		throw new Error('Order not found for this user');
	}

	const existing = await pocketbaseClient
		.collection('consultoria_orders')
		.getFirstListItem(`stripe_session_id = "${sessionId}"`)
		.catch(() => null);

	if (existing) {
		return mapOrder(existing);
	}

	const user = await pocketbaseClient.collection('users').getOne(userId);
	const lineItem = session.line_items.data[0];
	const product = lineItem.price.product;

	const record = await pocketbaseClient.collection('consultoria_orders').create({
		userId,
		email: user.email,
		product_title: typeof product === 'string' ? product : product.name,
		amount_in_cents: lineItem.amount_total,
		stripe_session_id: session.id,
	});

	return mapOrder(record);
}

function mapOrder(record) {
	return {
		id: record.id,
		productTitle: record.product_title,
		amountFormatted: formatBrl(record.amount_in_cents),
	};
}
