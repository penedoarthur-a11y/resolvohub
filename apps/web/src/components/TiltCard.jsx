import React, { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * 3D tilt-on-hover wrapper. Rotates the card slightly toward the cursor with
 * perspective, plus a soft lift. Honors reduced motion (no tilt).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.intensity=10] — max rotation in degrees
 * @param {string} [props.className]
 */
export default function TiltCard({ children, className = '', intensity = 10 }) {
    const ref = useRef(null);
    const [transform, setTransform] = useState('');
    const reduce = useReducedMotion();

    const handleMove = (e) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTransform(
            `perspective(1000px) rotateY(${px * intensity}deg) rotateX(${-py * intensity}deg) translateY(-8px)`,
        );
    };

    const handleLeave = () => setTransform('');

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ transform, transformStyle: 'preserve-3d' }}
            className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
        >
            {children}
        </div>
    );
}
