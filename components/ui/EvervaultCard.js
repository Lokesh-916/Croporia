'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * EvervaultCard — Aceternity-inspired hover-reveal card.
 * On hover, shows a moving radial gradient pattern and reveals hidden data.
 *
 * Props:
 *  - children: default visible content
 *  - revealContent: JSX shown when card is hovered
 *  - accentColor: hex color for the reveal gradient (default #c8882a)
 *  - className: extra classes for the outer wrapper
 */
export default function EvervaultCard({
  children,
  revealContent,
  accentColor = '#c8882a',
  className = '',
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-[20px] bg-white border border-[#c8882a]/10 cursor-pointer group ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Moving radial gradient — follows mouse */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}18 0%, transparent 65%)`,
        }}
      />

      {/* Noise texture overlay for paper-like feel */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      {/* DEFAULT content (always visible) */}
      <motion.div
        animate={{ opacity: hovered ? 0 : 1, y: hovered ? -8 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-20"
      >
        {children}
      </motion.div>

      {/* REVEALED content (shows on hover) */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute inset-0 z-20 flex flex-col justify-center"
      >
        {revealContent}
      </motion.div>
    </div>
  );
}
