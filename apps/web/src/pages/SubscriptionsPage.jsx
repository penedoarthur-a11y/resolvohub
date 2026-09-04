import React from 'react';
import { Helmet } from 'react-helmet';
import Reveal from '@/components/Reveal';
import AuroraBackground from '@/components/AuroraBackground';
import SubscriptionAccountSection from '@/components/SubscriptionAccountSection.jsx';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function SubscriptionsPage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
            <Helmet>
                <title>Minha assinatura — Resolvo Já</title>
                <meta name="description" content="Veja o plano ativo da sua conta Resolvo Já e gerencie a cobrança da assinatura." />
            </Helmet>
            <SiteHeader />
            <main className="relative overflow-hidden">
                <AuroraBackground variant="warm" />
                <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8">
                    <Reveal>
                        <h1 className="font-display text-4xl font-semibold tracking-tight">
                            Minha <span className="text-gradient-aurora">assinatura</span>
                        </h1>
                        <p className="mt-3 text-[hsl(var(--muted-foreground))]">Plano atual e gestão de cobrança.</p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-8">
                            <SubscriptionAccountSection className="rounded-3xl border border-white/10 glass-strong p-7 shadow-3d" />
                        </div>
                    </Reveal>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
