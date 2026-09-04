import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const links = [
    { to: '/', label: 'Hub' },
    { to: '/plans', label: 'Planos' },
    { to: '/painel', label: 'Meu painel' },
];

export default function SiteHeader() {
    const { isAuthed, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[hsl(var(--background))]/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:px-8">
                <Link to="/" className="group flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-aurora font-display text-sm font-bold text-white shadow-3d transition-transform group-hover:scale-105">R</span>
                    <span className="font-display text-lg font-semibold tracking-tight">Resolvo<span className="text-gradient-aurora">Hub</span></span>
                </Link>

                <nav className="hidden items-center gap-7 md:flex">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `text-sm transition-colors ${isActive ? 'text-gradient-aurora font-semibold' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                    {isAuthed ? (
                        <button onClick={handleLogout} className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-foreground">
                            Sair
                        </button>
                    ) : (
                        <Link to="/login" className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-foreground">
                            Entrar
                        </Link>
                    )}
                    <Link
                        to="/plans"
                        className="rounded-full bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-3d transition-transform hover:brightness-110 active:scale-[0.98]"
                    >
                        Assinar
                    </Link>
                </nav>

                <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-white/10 px-5 md:hidden"
                    >
                        <div className="flex flex-col gap-3 py-4">
                            {links.map((l) => (
                                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-sm text-[hsl(var(--muted-foreground))]">
                                    {l.label}
                                </Link>
                            ))}
                            {isAuthed ? (
                                <button onClick={handleLogout} className="py-2 text-left text-sm text-[hsl(var(--muted-foreground))]">Sair</button>
                            ) : (
                                <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm text-[hsl(var(--muted-foreground))]">Entrar</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
