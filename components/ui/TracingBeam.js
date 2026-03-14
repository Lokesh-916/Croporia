'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * TracingBeam — Aceternity-inspired vertical scroll-progress beam.
 * Wraps your content. A glowing line traces down the left side as
 * the user scrolls through the content.
 *
 * Props:
 *  - children: the long-form content to wrap
 *  - accentColor: color of the beam line (default #1a3d0a)
 *  - className: extra classes for the content wrapper
 */
export default function TracingBeam({ children, accentColor = '#1a3d0a', className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  // Glow dot position
  const [dotY, setDotY] = useState(0);
  const beamRef = useRef(null);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (beamRef.current) {
        const height = beamRef.current.getBoundingClientRect().height;
        setDotY(v * height);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Beam track */}
      <div
        ref={beamRef}
        className="absolute left-0 top-0 w-[2px] h-full"
        style={{ background: `${accentColor}15` }}
      >
        {/* Animated fill */}
        <motion.div
          style={{ background: accentColor, scaleY, transformOrigin: 'top', opacity: 0.7 }}
          className="absolute inset-0 rounded-full"
        />

        {/* Glowing dot that follows progress */}
        <motion.div
          animate={{ top: dotY }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="absolute -left-[5px] w-3 h-3 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: accentColor }}
        />

        {/* Glow halo */}
        <motion.div
          animate={{ top: dotY - 6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="absolute -left-[10px] w-[22px] h-[22px] rounded-full opacity-30 blur-sm"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Content — padded to make room for beam */}
      <div className="pl-10">
        {children}
      </div>
    </div>
  );
}
