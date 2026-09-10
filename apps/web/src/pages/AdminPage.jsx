import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/TiltCard';
import AuroraBackground from '@/components/AuroraBackground';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { AREAS, TOTAL_SOLUTIONS, getAreaGradient } from '@/data/hub';
import { useEcommerceSubscriptionsPlans } from '@/hooks/useEcommerceSubscriptionsPlans';
import { integratedAiClient } from '@/lib/integratedAiClient';

const STATUS_LABELS = {
    aguardando: { label: 'Aguardando', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    em_desenvolvimento: { label: 'Em desenvolvimento', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    entregue: { label: 'Entregue', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
};

const statGradients = ['bg-gradient-blue-purple', 'bg-gradient-green-blue', 'bg-gradient-orange-pink'];

function BriefingRow({ b, onStatusChange }) {
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const st = STATUS_LABELS[b.status] ?? STATUS_LABELS.aguardando;
    const nextStatus = { aguardando: 'em_desenvolvimento', em_desenvolvimento: 'entregue', entregue: null };

    const handleAdvance = async () => {
        const next = nextStatus[b.status];
        if (!next) return;
        setUpdating(true);
        try {
            await integratedAiClient.fetch(`/admin/briefings/${b.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            });
            onStatusChange(b.id, next);
        } catch {
            // silently fail; user can retry
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{b.subdivisao}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-[hsl(var(--muted-foreground))]">
                        {b.area_nome} · {b.empresa || 'empresa não informada'} · {b.porte}
                    </p>
                    <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {new Date(b.created).toLocaleString('pt-BR')}
                    </p>
                </div>
                {open ? <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />}
            </button>

            {open && (
                <div className="px-5 pb-5 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {b.setor && <p><span className="text-[hsl(var(--muted-foreground))]">Setor:</span> {b.setor}</p>}
                        {b.objetivo && <p><span className="text-[hsl(var(--muted-foreground))]">Objetivo:</span> {b.objetivo}</p>}
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Problema</p>
                        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{b.problema}</p>
                    </div>
                    {b.tentativas && (
                        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Já tentou</p>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{b.tentativas}</p>
                        </div>
                    )}
                    {b.preview && (
                        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Prévia gerada</p>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{b.preview}</p>
                        </div>
                    )}
                    {nextStatus[b.status] && (
                        <button
                            type="button"
                            onClick={handleAdvance}
                            disabled={updating}
                            className="mt-4 rounded-xl bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                        >
                            {updating ? 'Atualizando…' : `Marcar como "${STATUS_LABELS[nextStatus[b.status]]?.label}"`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminPage() {
    const { plans, loading: plansLoading, error: plansError } = useEcommerceSubscriptionsPlans();
    const [briefings, setBriefings] = useState([]);
    const [briefingsLoading, setBriefingsLoading] = useState(true);
    const [briefingsError, setBriefingsError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [consultoriaOrders, setConsultoriaOrders] = useState([]);
    const [consultoriaLoading, setConsultoriaLoading] = useState(true);
    const [consultoriaError, setConsultoriaError] = useState(null);

    useEffect(() => {
        setBriefingsLoading(true);
        setBriefingsError(null);
        const url = `/admin/briefings${statusFilter ? `?status=${statusFilter}` : ''}`;
        integratedAiClient.fetch(url)
            .then((data) => setBriefings(data.items ?? []))
            .catch((err) => setBriefingsError(err.message))
            .finally(() => setBriefingsLoading(false));
    }, [statusFilter]);

    useEffect(() => {
        integratedAiClient.fetch('/admin/consultoria-orders')
            .then((data) => setConsultoriaOrders(data.items ?? []))
            .catch((err) => setConsultoriaError(err.message))
            .finally(() => setConsultoriaLoading(false));
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setBriefings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
            <Helmet>
                <title>Painel administrativo — Resolvo Já</title>
                <meta name="description" content="Visão administrativa do catálogo de áreas, subdivisões e planos de assinatura do Resolvo Já." />
            </Helmet>
            <SiteHeader />

            <main className="relative overflow-hidden">
                <AuroraBackground />
                <div className="relative mx-auto max-w-[80rem] px-5 py-16 sm:px-8">
                    <Reveal>
                        <h1 className="font-display text-4xl font-semibold tracking-tight">
                            Painel <span className="text-gradient-aurora">administrativo</span>
                        </h1>
                    </Reveal>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        {[
                            { l: 'Áreas ativas', v: AREAS.length },
                            { l: 'Subdivisões mapeadas', v: TOTAL_SOLUTIONS },
                            { l: 'Planos de assinatura', v: plansLoading ? '—' : plans.length },
                        ].map((s, i) => (
                            <Reveal key={s.l} delay={i * 0.06}>
                                <TiltCard intensity={8} className="h-full">
                                    <div className="relative overflow-hidden rounded-2xl border border-white/10 glass p-6 shadow-3d">
                                        <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${statGradients[i]} opacity-40 blur-2xl`} aria-hidden="true" />
                                        <p className="relative font-display text-4xl font-semibold text-gradient-aurora">{s.v}</p>
                                        <p className="relative mt-2 text-sm text-[hsl(var(--muted-foreground))]">{s.l}</p>
                                    </div>
                                </TiltCard>
                            </Reveal>
                        ))}
                    </div>

                    {/* Pedidos recebidos */}
                    <section className="mt-12">
                        <Reveal>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="font-display text-2xl font-semibold">Pedidos recebidos</h2>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm outline-none transition-colors focus:border-[hsl(var(--primary))]"
                                >
                                    <option value="" className="bg-[hsl(var(--card))]">Todos</option>
                                    <option value="aguardando" className="bg-[hsl(var(--card))]">Aguardando</option>
                                    <option value="em_desenvolvimento" className="bg-[hsl(var(--card))]">Em desenvolvimento</option>
                                    <option value="entregue" className="bg-[hsl(var(--card))]">Entregue</option>
                                </select>
                            </div>
                        </Reveal>

                        {briefingsError && (
                            <p className="mt-4 text-sm text-[hsl(var(--destructive))]">
                                Falha ao carregar pedidos: {briefingsError}
                            </p>
                        )}
                        {briefingsLoading && (
                            <div className="mt-4 h-24 animate-pulse rounded-2xl border border-white/10 bg-[hsl(var(--card))]" />
                        )}
                        {!briefingsLoading && !briefingsError && briefings.length === 0 && (
                            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Nenhum pedido ainda.</p>
                        )}
                        {!briefingsLoading && briefings.length > 0 && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 glass">
                                {briefings.map((b) => (
                                    <BriefingRow key={b.id} b={b} onStatusChange={handleStatusChange} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Consultorias contratadas */}
                    <section className="mt-12">
                        <Reveal>
                            <h2 className="font-display text-2xl font-semibold">Consultorias contratadas</h2>
                        </Reveal>
                        {consultoriaError && (
                            <p className="mt-4 text-sm text-[hsl(var(--destructive))]">Falha ao carregar consultorias: {consultoriaError}</p>
                        )}
                        {consultoriaLoading && (
                            <div className="mt-4 h-24 animate-pulse rounded-2xl border border-white/10 bg-[hsl(var(--card))]" />
                        )}
                        {!consultoriaLoading && !consultoriaError && consultoriaOrders.length === 0 && (
                            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Nenhuma consultoria contratada ainda.</p>
                        )}
                        {!consultoriaLoading && consultoriaOrders.length > 0 && (
                            <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 glass">
                                {consultoriaOrders.map((o) => (
                                    <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                                        <div>
                                            <p className="font-semibold">{o.email}</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{o.product_title}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">R${(o.amount_in_cents / 100).toFixed(2).replace('.', ',')}</span>
                                            <span className="text-[hsl(var(--muted-foreground))]">{new Date(o.created).toLocaleString('pt-BR')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Planos */}
                    <section className="mt-12">
                        <Reveal>
                            <h2 className="font-display text-2xl font-semibold">Planos e preços</h2>
                        </Reveal>
                        {plansError && <p className="mt-4 text-sm text-[hsl(var(--destructive))]">Falha ao carregar os planos.</p>}
                        {plansLoading && <div className="mt-4 h-24 animate-pulse rounded-2xl border border-white/10 bg-[hsl(var(--card))]" />}
                        {!plansLoading && !plansError && plans.length === 0 && (
                            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Nenhum plano cadastrado ainda.</p>
                        )}
                        <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 glass">
                            {plans.map((plan) => (
                                <div key={plan.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                                    <div>
                                        <p className="font-semibold">{plan.title}</p>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{plan.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        {(plan.variants ?? []).map((v) => (
                                            <span key={v.id} className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                                                {v.title}: {v.price_formatted}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Catálogo */}
                    <section className="mt-12">
                        <Reveal>
                            <h2 className="font-display text-2xl font-semibold">Catálogo de áreas</h2>
                        </Reveal>
                        <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 glass">
                            {AREAS.map((a) => {
                                const g = getAreaGradient(a.id);
                                return (
                                    <details key={a.id} className="group p-5">
                                        <summary className="flex cursor-pointer items-center gap-3 font-semibold">
                                            <span className={`grid h-9 w-9 place-items-center rounded-xl ${g.gradient} text-lg shadow-3d`} aria-hidden="true">{a.icon}</span>
                                            {a.name}
                                            <span className="font-normal text-[hsl(var(--muted-foreground))]">— {a.items.length} subdivisões</span>
                                        </summary>
                                        <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{a.items.join(' · ')}</p>
                                    </details>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
