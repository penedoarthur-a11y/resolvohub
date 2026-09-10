import { useEffect, useState } from 'react';
import { getOneTimeProducts } from '@/api/InternalEcommerceProductsApi';

/**
 * Fetches active one-time (non-subscription) products from our backend (`GET
 * /ecommerce/products`), which reads them live from Stripe — e.g. the Consultoria.
 *
 * Usage:
 *   import { useOneTimeProducts } from '@/hooks/useOneTimeProducts';
 *   const { products, loading, error } = useOneTimeProducts();
 *
 * @returns {{
 *   products: Array<object>,
 *   loading: boolean,
 *   error: Error | null,
 * }}
 */
export function useOneTimeProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;

		getOneTimeProducts()
			.then((data) => {
				if (cancelled) return;
				setProducts(data?.products ?? []);
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

	return { products, loading, error };
}
