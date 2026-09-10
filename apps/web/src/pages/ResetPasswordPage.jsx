import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Lands here from the PocketBase password-reset email link. PocketBase's own
 * "Auth confirm password reset" email template must be set (in the PocketBase
 * dashboard, Settings → users collection → password reset template) to point
 * to `{APP_URL}/redefinir-senha?token={TOKEN}` for that link to reach this page.
 */
export default function ResetPasswordPage() {
	const { confirmPasswordReset } = useAuth();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await confirmPasswordReset(token, password);
			navigate('/login');
		} catch {
			setError('Não foi possível redefinir a senha. O link pode ter expirado — peça um novo.');
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
				<SiteHeader />
				<main className="mx-auto max-w-md px-5 py-20 text-center">
					<p>Link inválido.</p>
					<Link to="/esqueci-senha" className="mt-4 inline-block font-semibold text-gradient-aurora">Pedir novo link</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Redefinir senha — Resolvo Já</title>
			</Helmet>
			<SiteHeader />
			<main className="relative overflow-hidden">
				<AuroraBackground variant="cool" />
				<div className="relative mx-auto grid max-w-md gap-6 px-5 py-20">
					<motion.h1
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="font-display text-3xl font-semibold"
					>
						Redefinir senha
					</motion.h1>
					<form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 glass-strong p-7 shadow-3d">
						<div className="grid gap-2">
							<label className="text-sm font-medium" htmlFor="password">Nova senha</label>
							<input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))] focus:bg-white/[0.07]" />
						</div>
						{error && <p className="text-sm text-[hsl(var(--destructive))]" role="alert">{error}</p>}
						<button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-5 py-3 font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
							{loading ? 'Salvando…' : 'Salvar nova senha'}
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
