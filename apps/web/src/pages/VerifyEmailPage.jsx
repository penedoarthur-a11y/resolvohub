import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import pb from '@/lib/pocketbaseClient';

/**
 * Lands here from the PocketBase verification email link
 * (`{APP_URL}/verificar-email?token={TOKEN}`, see the fix_app_url_and_email_templates migration).
 */
export default function VerifyEmailPage() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [status, setStatus] = useState(token ? 'loading' : 'invalid');

	useEffect(() => {
		if (!token) return;
		pb.collection('users')
			.confirmVerification(token)
			.then(() => setStatus('ok'))
			.catch(() => setStatus('error'));
	}, [token]);

	const messages = {
		loading: 'Confirmando seu e-mail…',
		ok: 'E-mail confirmado! Você já pode usar sua conta.',
		error: 'Não foi possível confirmar o e-mail. O link pode ter expirado ou já ter sido usado.',
		invalid: 'Link inválido.',
	};

	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Confirmar e-mail — Resolvo Já</title>
			</Helmet>
			<SiteHeader />
			<main className="relative overflow-hidden">
				<AuroraBackground variant="cool" />
				<div className="relative mx-auto grid max-w-md gap-6 px-5 py-20 text-center">
					<h1 className="font-display text-3xl font-semibold">Confirmar e-mail</h1>
					<p role={status === 'error' || status === 'invalid' ? 'alert' : 'status'}>{messages[status]}</p>
					{status !== 'loading' && (
						<Link to="/login" className="font-semibold text-gradient-aurora">Ir para o login</Link>
					)}
				</div>
			</main>
		</div>
	);
}
