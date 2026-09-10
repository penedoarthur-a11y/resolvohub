import { useEffect, useState } from 'react';
import apiServerClient from '@/lib/apiServerClient';

/**
 * Fetches subscription plans from our own backend (`GET /ecommerce/plans`), which reads
 * them live from Stripe. Each item in `plans` has the same shape the old Hostinger
 * catalog used to return (`id`, `title`, `description`, `variants[]`).
 *
 * Usage (Plans / pricing page — do not hardcode tiers):
 *   import { useEcommerceSubscriptionsPlans } from '@/hooks/useEcommerceSubscriptionsPlans';
 *   import SubscribeButton from '@/components/SubscribeButton.jsx';
 *
 *   const { plans, loading, error } = useEcommerceSubscriptionsPlans();
 *   if (loading) return <PlansSkeleton />;
 *   if (error) return <p>Failed to load subscription plans.</p>;
 *   if (!plans.length) return <p>No subscription plans available yet.</p>;
 *
 *   plans.map((plan) => {
 *     const variant = plan.variants?.[0];
 *     return variant ? <SubscribeButton key={plan.id} plan={plan} variant={variant} /> : null;
 *   });
 *
 * @returns {{
 *   plans: Array<object>,
 *   loading: boolean,
 *   error: Error | null,
 * }}
 */
export function useEcommerceSubscriptionsPlans() {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;

		apiServerClient.fetch('/ecommerce/plans')
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch plans: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				if (cancelled) return;
				setPlans(data?.plans ?? []);
			})
			.catch((err) => {
				if (cancelled) return;
				setError(err);
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return { plans, loading, error };
}
