import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOneTimeProducts } from '@/hooks/useOneTimeProducts';
import { createOneTimeCheckout } from '@/api/InternalEcommerceProductsApi';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';

/**
 * Card for the Consultoria (avulso one-time purchase, not a subscription plan) — talking
 * to an expert instead of generating a solution. Renders whatever active one-time
 * products the backend returns (currently just Consultoria) so a second one-time
 * service can be added later from the Stripe dashboard without a code change.
 *
 * Usage (pricing page, alongside PlansList):
 *   import ConsultoriaCard from '@/components/ConsultoriaCard.jsx';
 *   <ConsultoriaCard />
 */
export default function ConsultoriaCard() {
	const { products, loading, error } = useOneTimeProducts();

	if (loading || error || !products.length) {
		return null;
	}

	return (
		<div className="grid gap-6 md:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

function ProductCard({ product }) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const { isAuthenticated } = useSubscriptionAuth();
	const navigate = useNavigate();

	const handleClick = async () => {
		if (!isAuthenticated) {
			navigate(LOGIN_PATH);
			return;
		}
		setErrorMessage(null);
		setLoading(true);
		try {
			const { url } = await createOneTimeCheckout({
				priceId: product.priceId,
				successUrl: window.location.origin + '/consultoria/obrigado?session_id={CHECKOUT_SESSION_ID}',
				cancelUrl: window.location.href,
			});
			window.location = url;
		} catch (err) {
			console.error('Checkout failed', err);
			setLoading(false);
			setErrorMessage('Não foi possível iniciar o checkout. Tente novamente.');
		}
	};

	return (
		<div className="rounded-lg border bg-card p-6 flex flex-col">
			<h3 className="text-xl font-semibold mb-2">{product.title}</h3>
			{product.description && (
				<p className="text-muted-foreground mb-4">{product.description}</p>
			)}
			<p className="text-3xl font-bold mb-6">
				{product.price_formatted}
				<span className="text-sm font-normal text-muted-foreground"> avulso</span>
			</p>
			<div className="mt-auto">
				<button
					type="button"
					onClick={handleClick}
					disabled={loading}
					className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 disabled:opacity-60"
				>
					{loading ? 'Redirecionando…' : `Contratar ${product.title}`}
				</button>
				{errorMessage && (
					<p className="text-sm text-destructive mt-2" role="alert">{errorMessage}</p>
				)}
			</div>
		</div>
	);
}
