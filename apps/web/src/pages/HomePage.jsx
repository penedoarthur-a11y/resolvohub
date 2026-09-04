import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import Parallax from '@/components/Parallax';
import TiltCard from '@/components/TiltCard';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { AREAS, TOTAL_SOLUTIONS, getAreaGradient } from '@/data/hub';

const steps = [
    { n: '01', t: 'Escolha a área', d: 'Sete frentes cobrem o dia a dia de uma pequena empresa.' },
    { n: '02', t: 'Aponte o problema', d: 'Selecione a subdivisão exata que está travando o negócio.' },
    { n: '03', t: 'Conte o contexto', d: 'Um formulário curto sobre porte, setor e o que já tentou.' },
    { n: '04', t: 'Receba a prévia', d: 'A IA devolve diagnóstico, estrutura da solução e o primeiro passo.' },
];

const stats = [
    { v: 7, s: '', l: 'áreas cobertas' },
    { v: TOTAL_SOLUTIONS, s: '', l: 'problemas mapeados' },
    { v: 3, s: 'min', l: 'para a prévia' },
    { v: 2, s: '', l: 'formas de comprar' },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
            <Helmet>
                <title>ResolvoHub — hub de soluções por IA para pequenas empresas</title>
                <meta name="description" content="Escolha a área, aponte o problema e receba uma solução personalizada gerada por IA: gestão, operações, fiscal, administrativo, tecnologia, estoque e RH." />
            </Helmet>

            <SiteHeader />

            {/* ===== Hero ===== */}
            <section className="relative overflow-hidden">
                <AuroraBackground />
                <div className="relative mx-auto grid min-h-[100dvh] max-w-[90rem] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <div>
                        <Reveal>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] backdrop-blur">
                                <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Soluções geradas por IA
                            </span>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
                                O problema da sua empresa
                                <span className="relative ml-3 inline-block text-gradient-aurora">
                                    tem solução
                                    <svg viewBox="0 0 300 14" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                                        <path d="M2 10C60 3 150 2 298 7" fill="none" stroke="url(#hg)" strokeWidth="4" strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="hg" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#60a5fa" />
                                                <stop offset="0.5" stopColor="#a855f7" />
                                                <stop offset="1" stopColor="#ec4899" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.16}>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                                Sete áreas, {TOTAL_SOLUTIONS} frentes de problema. Você descreve o contexto, a IA devolve uma prévia
                                da solução na hora — e a versão completa vem com modelos, planilhas e plano de implementação.
                            </p>
                        </Reveal>
                        <Reveal delay={0.24}>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <a
                                    href="#areas"
                                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98]"
                                >
                                    Explorar as 7 áreas
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>
                                <Link
                                    to="/plans"
                                    className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold backdrop-blur transition-colors hover:bg-white/10"
                                >
                                    Ver planos
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    <Parallax speed={0.25}>
                        <Reveal delay={0.2} y={32}>
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((k, i) => (
                                    <TiltCard
                                        key={k.l}
                                        intensity={8}
                                        className={`rounded-2xl border border-white/10 glass p-6 shadow-3d ${i % 2 ? 'translate-y-6' : ''}`}
                                    >
                                        <p className="font-display text-4xl font-semibold text-gradient-aurora">
                                            <CountUp value={k.v} suffix={k.s} />
                                        </p>
                                        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{k.l}</p>
                                    </TiltCard>
                                ))}
                            </div>
                        </Reveal>
                    </Parallax>
                </div>
            </section>

            {/* ===== Marquee ===== */}
            <section className="relative border-y border-white/10 bg-[hsl(var(--card))] py-4">
                <div className="flex gap-10 overflow-hidden">
                    <div className="flex min-w-full shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 whitespace-nowrap text-sm uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] motion-reduce:animate-none">
                        {AREAS.concat(AREAS).map((a, i) => (
                            <span key={`${a.id}-${i}`} className="flex items-center gap-3">
                                <span aria-hidden="true">{a.icon}</span>{a.name}
                                <span className="text-gradient-orange-pink">/</span>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Areas ===== */}
            <section id="areas" className="relative overflow-hidden">
                <AuroraBackground variant="cool" />
                <div className="relative mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
                    <Reveal>
                        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                            Escolha por onde <span className="text-gradient-blue-purple">começar</span>
                        </h2>
                        <p className="mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
                            Cada área abre uma lista de subdivisões. Clique na que descreve o seu problema e siga para o formulário.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {AREAS.map((area, i) => {
                            const g = getAreaGradient(area.id);
                            return (
                                <Reveal key={area.id} delay={i * 0.05}>
                                    <TiltCard intensity={9} className="h-full">
                                        <Link
                                            to={`/area/${area.id}`}
                                            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 glass p-7 shadow-3d transition-colors hover:border-white/25"
                                        >
                                            <div
                                                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                                                style={{ background: g.glow }}
                                                aria-hidden="true"
                                            />
                                            <div className="relative">
                                                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${g.gradient} text-2xl shadow-3d`} aria-hidden="true">
                                                    {area.icon}
                                                </span>
                                                <h3 className="mt-5 font-display text-2xl font-semibold">{area.name}</h3>
                                                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{area.tagline}</p>
                                            </div>
                                            <div className="relative mt-8 flex items-center justify-between text-sm">
                                                <span className="text-[hsl(var(--muted-foreground))]">{area.items.length} subdivisões</span>
                                                <span className="inline-flex items-center gap-1 font-semibold">
                                                    <span className="text-gradient-aurora">Abrir</span>
                                                    <ArrowRight className="h-4 w-4 text-[hsl(var(--primary))] transition-transform group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </Link>
                                    </TiltCard>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== How it works ===== */}
            <section className="relative overflow-hidden border-t border-white/10 bg-[hsl(var(--card))]">
                <AuroraBackground variant="warm" />
                <div className="relative mx-auto max-w-[72rem] px-5 py-24 sm:px-8">
                    <Reveal>
                        <h2 className="font-display text-4xl font-semibold tracking-tight">
                            Como <span className="text-gradient-orange-pink">funciona</span>
                        </h2>
                    </Reveal>
                    <ol className="mt-12 divide-y divide-white/10 border-y border-white/10">
                        {steps.map((s, i) => (
                            <Reveal key={s.n} delay={i * 0.06}>
                                <li className="group grid gap-3 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-[6rem_16rem_1fr] md:items-baseline">
                                    <span className="font-display text-3xl text-gradient-aurora">{s.n}</span>
                                    <span className="flex items-center gap-2 font-display text-xl font-semibold">
                                        <Zap className="h-4 w-4 text-[hsl(var(--primary))]" /> {s.t}
                                    </span>
                                    <span className="text-[hsl(var(--muted-foreground))]">{s.d}</span>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                    <Reveal delay={0.1}>
                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                to="/plans"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98]"
                            >
                                Assinar e destravar tudo <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#areas"
                                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold backdrop-blur transition-colors hover:bg-white/10"
                            >
                                Testar uma prévia grátis
                            </a>
                        </div>
                    </Reveal>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
