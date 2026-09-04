import React from 'react';
import { Link } from 'react-router-dom';
import { TOTAL_SOLUTIONS } from '@/data/hub';

export default function SiteFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-[hsl(var(--card))]">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[60rem] -translate-x-1/2 rounded-full bg-gradient-aurora opacity-20 blur-[120px]" aria-hidden="true" />
            <div className="relative mx-auto grid max-w-[90rem] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
                <div>
                    <p className="font-display text-xl font-semibold">Resolvo<span className="text-gradient-aurora">Hub</span></p>
                    <p className="mt-3 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
                        {TOTAL_SOLUTIONS} soluções geradas por IA para pequenas empresas resolverem problemas reais de gestão, operação, fiscal, tecnologia, estoque e pessoas.
                    </p>
                </div>
                <div className="text-sm">
                    <p className="mb-3 font-semibold">Navegar</p>
                    <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li><Link to="/" className="transition-colors hover:text-foreground">Hub de áreas</Link></li>
                        <li><Link to="/plans" className="transition-colors hover:text-foreground">Planos e preços</Link></li>
                        <li><Link to="/painel" className="transition-colors hover:text-foreground">Meu painel</Link></li>
                        <li><Link to="/admin" className="transition-colors hover:text-foreground">Painel administrativo</Link></li>
                    </ul>
                </div>
                <div className="text-sm">
                    <p className="mb-3 font-semibold">Contato</p>
                    <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li>contato@resolvohub.com.br</li>
                        <li>Seg a sex, 9h às 18h</li>
                    </ul>
                </div>
            </div>
            <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-[hsl(var(--muted-foreground))] sm:px-8">
                © {new Date().getFullYear()} ResolvoHub. Todos os direitos reservados.
            </div>
        </footer>
    );
}
