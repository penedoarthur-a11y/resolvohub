import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '@/api/InternalEcommerceSubscriptionsApi';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { LOGIN_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';

/**
 * Shipped checkout CTA: {@link createCheckoutSession} with a Stripe price id, then `window.location` redirect.
 *
 * Usage (inside a plan card from {@link useEcommerceSubscriptionsPlans}):
 *   import SubscribeButton from '@/components/SubscribeButton.jsx';
 *   <SubscribeButton plan={plan} variant={plan.variants[0]} />
 *
 * @param {{ plan: object, variant: object, className?: string, label?: string }} props
 */
export default function SubscribeButton({ plan, variant, className, label }) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const { isAuthenticated, refreshSubscriptions } = useSubscriptionAuth();
	const navigate = useNavigate();

	const handleClick = async () => {
		if (!isAuthenticated) {
			navigate(LOGIN_PATH);
			return;
		}
		setErrorMessage(null);
		setLoading(true);
		try {
			const { url } = await createCheckoutSession({
				priceId: variant.id,
				successUrl: window.location.origin + MANAGE_PATH + '?just_subscribed=1',
				cancelUrl: window.location.origin + MANAGE_PATH + '?just_subscribed=1',
			});
			// sessionStorage survives the same-tab redirect through Stripe Checkout
			// and lets PlansList / SubscriptionAccountSection poll for the new
			// subscription on return.
			sessionStorage.setItem('subscriptionPending', String(Date.now()));
			window.location = url;
		} catch (err) {
			console.error('Checkout failed', err);
			setLoading(false);
			// Defense in depth for the stale-tab race: if checkout failed because
			// the user already has an active subscription, refreshing subscriptions
			// surfaces the existing one — the locked-card UI re-renders and we route
			// them to the Manage page. Any other failure leaves them on /plans with
			// an inline error message.
			const freshSubscriptions = await refreshSubscriptions();
			const hasActive = freshSubscriptions.some(
				(subscription) => subscription && (subscription.status === 'active' || subscription.status === 'trialing'),
			);
			if (hasActive) {
				navigate(MANAGE_PATH);
			} else {
				setErrorMessage('Não foi possível iniciar o checkout. Tente novamente.');
			}
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleClick}
				disabled={loading}
				className={className ?? 'w-full rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 disabled:opacity-60'}
			>
				{loading ? 'Redirecionando…' : (label ?? `Assinar ${plan?.title ?? 'plano'}`)}
			</button>
			{errorMessage && (
				<p className="text-sm text-destructive mt-2" role="alert">{errorMessage}</p>
			)}
		</div>
	);
}
