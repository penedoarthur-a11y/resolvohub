import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (form.password.length < 10) {
            setError('A senha precisa ter pelo menos 10 caracteres.');
            return;
        }
        setLoading(true);
        try {
            await signup(form.email, form.password, { name: form.name });
            navigate('/painel');
        } catch {
            setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
            <Helmet>
                <title>Criar conta — Resolvo Já</title>
                <meta name="description" content="Crie sua conta gratuita no Resolvo Já e gere prévias de soluções personalizadas por IA para a sua empresa." />
            </Helmet>
            <SiteHeader />
            <main className="relative overflow-hidden">
                <AuroraBackground variant="warm" />
                <div className="relative mx-auto grid max-w-md gap-6 px-5 py-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-3xl font-semibold"
                    >
                        Criar conta
                    </motion.h1>
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="grid gap-4 rounded-3xl border border-white/10 glass-strong p-7 shadow-3d"
                    >
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="nome">Nome</label>
                            <input id="nome" required value={form.name} onChange={update('name')} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))] focus:bg-white/[0.07]" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="email">E-mail</label>
                            <input id="email" type="email" required value={form.email} onChange={update('email')} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))] focus:bg-white/[0.07]" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="senha">Senha (mín. 10 caracteres)</label>
                            <input id="senha" type="password" required value={form.password} onChange={update('password')} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))] focus:bg-white/[0.07]" />
                        </div>
                        {error && <p className="text-sm text-[hsl(var(--destructive))]" role="alert">{error}</p>}
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-5 py-3 font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                            <UserPlus className="h-4 w-4" />
                            {loading ? 'Criando…' : 'Criar conta'}
                        </button>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Enviamos um e-mail de confirmação: clique no link antes de gerar as prévias com IA.
                        </p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Já tem conta? <Link to="/login" className="font-semibold text-gradient-aurora">Entrar</Link>
                        </p>
                    </motion.form>
                </div>
            </main>
        </div>
    );
}
