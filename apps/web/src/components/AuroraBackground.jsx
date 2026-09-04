import React from 'react';

/**
 * Animated aurora gradient blobs that sit behind a section and "breathe".
 * Purely decorative — pointer-events disabled, aria-hidden.
 */
export default function AuroraBackground({ className = '', variant = 'default' }) {
    const palettes = {
        default: [
            'bg-indigo-500/30',
            'bg-fuchsia-500/25',
            'bg-emerald-400/20',
        ],
        warm: [
            'bg-amber-500/30',
            'bg-rose-500/25',
            'bg-violet-500/20',
        ],
        cool: [
            'bg-sky-500/30',
            'bg-cyan-400/25',
            'bg-indigo-500/20',
        ],
    };
    const [a, b, c] = palettes[variant] ?? palettes.default;

    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
            <div className={`blob absolute -top-40 -left-32 h-[40rem] w-[40rem] ${a} animate-blob`} />
            <div className={`blob absolute top-1/3 -right-32 h-[36rem] w-[36rem] ${b} animate-blob [animation-delay:5s]`} />
            <div className={`blob absolute -bottom-32 left-1/4 h-[32rem] w-[32rem] ${c} animate-blob [animation-delay:10s]`} />
            <div className="absolute inset-0 bg-grid opacity-40" />
        </div>
    );
}
