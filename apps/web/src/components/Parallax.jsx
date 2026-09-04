import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Lightweight scroll parallax wrapper. Translates its children on the Y axis
 * based on the element's position in the viewport. Honors reduced motion.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.speed=0.3] — travel distance multiplier (higher = more drift)
 * @param {string} [props.className]
 */
export default function Parallax({ children, speed = 0.3, className = '' }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const distance = reduce ? 0 : speed * 120;
    const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}
