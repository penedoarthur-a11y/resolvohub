import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
	const { requestPasswordReset } = useAuth();
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await requestPasswordReset(email);
		} catch {
			// Same message either way — don't leak whether an email exists in the system.
		}
		setSent(true);
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Recuperar senha — Resolvo Já</title>
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
						Recuperar senha
					</motion.h1>
					{sent ? (
						<div className="rounded-3xl border border-white/10 glass-strong p-7">
							<p>Se esse e-mail tiver uma conta, enviamos um link para redefinir a senha.</p>
							<Link to="/login" className="mt-4 inline-block font-semibold text-gradient-aurora">Voltar para o login</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 glass-strong p-7 shadow-3d">
							<div className="grid gap-2">
								<label className="text-sm font-medium" htmlFor="email">E-mail</label>
								<input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))] focus:bg-white/[0.07]" />
							</div>
							<button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-5 py-3 font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
								{loading ? 'Enviando…' : 'Enviar link de recuperação'}
							</button>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
