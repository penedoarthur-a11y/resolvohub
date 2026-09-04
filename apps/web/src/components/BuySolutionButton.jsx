import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, initializeCheckout } from '@/api/EcommerceApi';
import { useAuth } from '@/contexts/AuthContext';

const ONE_OFF_TITLE = 'Solução completa avulsa';

export default function BuySolutionButton({ context, className }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isAuthed } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        getProducts({})
            .then((res) => {
                if (cancelled) return;
                const found = (res?.products ?? []).find((p) => p.title === ONE_OFF_TITLE) ?? (res?.products ?? [])[0];
                setProduct(found ?? null);
            })
            .catch(() => setProduct(null));
        return () => { cancelled = true; };
    }, []);

    const variant = product?.variants?.[0];

    const handleClick = async () => {
        if (!isAuthed) {
            navigate('/login');
            return;
        }
        if (!variant) return;
        setError(null);
        setLoading(true);
        try {
            const { url } = await initializeCheckout({
                items: [{ variant_id: variant.id, quantity: 1 }],
                successUrl: `${window.location.origin}/painel?compra=1`,
                cancelUrl: window.location.href,
                customer: { external_id: user?.id, email: user?.email },
            });
            sessionStorage.setItem('ultimaSolucao', JSON.stringify(context ?? {}));
            window.location = url;
        } catch {
            setError('Não foi possível iniciar o checkout. Tente novamente.');
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                disabled={loading || !variant}
                className={className ?? 'w-full rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60'}
            >
                {loading ? 'Redirecionando…' : variant ? `Comprar solução completa — ${variant.price_formatted}` : 'Carregando preço…'}
            </button>
            {error && <p className="mt-2 text-sm text-[hsl(var(--destructive))]" role="alert">{error}</p>}
        </div>
    );
}
