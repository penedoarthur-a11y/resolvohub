import React from 'react';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { activeSubscription } from '@/lib/ecommerceSubscriptionsUtils';
import ManageSubscriptionButton from './ManageSubscriptionButton.jsx';

/**
 * Shipped account-area subscription card: shows the current plan + Manage portal entry
 * when the user has an active subscription, otherwise prompts them to view plans.
 * Returns null for logged-out users (auth-gated).
 *
 * Post-checkout polling is handled by {@link SubscriptionAuthProvider}. When the user
 * returns from Ecommerce API checkout (regardless of which page they land on), the provider
 * polls for the new subscription using the `subscriptionPending` sessionStorage flag
 * set by SubscribeButton. This component just reads `polling` / `pollingExhausted`
 * from the context to render the appropriate state — no flag handling needed here.
 *
 * This is the canonical "always-visible Manage" affordance — mount it on a Profile /
 * Account / Dashboard page reachable from the authenticated nav. It is also the page
 * SubscribeButton's `successUrl` points at (when Ecommerce API honors it).
 *
 * Usage:
 *   import SubscriptionAccountSection from '@/components/SubscriptionAccountSection.jsx';
 *   <SubscriptionAccountSection /> // optional className overrides the card wrapper
 *
 * Agents may restyle layout, copy, and pill styling freely; keep the
 * `<ManageSubscriptionButton />` mount and the auth gate.
 *
 * @param {{ className?: string }} props
 */
export default function SubscriptionAccountSection({ className }) {
	const { isAuthenticated, subscriptions, polling, pollingExhausted } = useSubscriptionAuth();

	if (!isAuthenticated) return null;

	const active = activeSubscription(subscriptions);
	const wrapper = className ?? 'rounded-lg border bg-card p-6';

	if (polling) {
		return (
			<section className={wrapper}>
				<div className="flex items-center gap-3 mb-2">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<h2 className="text-lg font-semibold">Ativando sua assinatura…</h2>
				</div>
				<p className="text-muted-foreground">
					Aguarde enquanto finalizamos seu pagamento. Isso costuma levar alguns segundos.
				</p>
			</section>
		);
	}

	if (pollingExhausted && !active) {
		return (
			<section className={wrapper}>
				<h2 className="text-lg font-semibold mb-2">Quase lá</h2>
				<p className="text-muted-foreground mb-4">
					Seu pagamento está sendo processado. Atualize a página daqui a pouco para ver sua assinatura.
				</p>
				<ManageSubscriptionButton />
			</section>
		);
	}

	if (!active) {
		return (
			<section className={wrapper}>
				<h2 className="text-lg font-semibold mb-2">Assinatura</h2>
				<p className="text-muted-foreground mb-4">
					Você não tem uma assinatura ativa. Desbloqueie recursos premium com um plano pago.
				</p>
				<ManageSubscriptionButton />
			</section>
		);
	}

	const statusLabel = active.status === 'trialing' ? 'Em teste' : 'Ativa';

	return (
		<section className={wrapper}>
			<div className="flex items-start justify-between gap-4 mb-4">
				<div>
					<h2 className="text-lg font-semibold">Assinatura</h2>
					<p className="text-2xl font-bold mt-1">{active.product_title}</p>
				</div>
				<span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
					{statusLabel}
				</span>
			</div>
			<ManageSubscriptionButton />
		</section>
	);
}
