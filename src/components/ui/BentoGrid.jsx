'use client';
import { motion } from 'framer-motion';

/**
 * BentoGrid — Aceternity-inspired responsive bento grid layout.
 * Usage: wrap BentoGridItem components inside BentoGrid.
 */
export function BentoGrid({ children, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)] ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  icon,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-[20px] bg-white 
        border border-[#c8882a]/10 
        shadow-[0_4px_24px_rgba(42,31,20,0.06)]
        hover:shadow-[0_12px_40px_rgba(42,31,20,0.14)]
        transition-shadow duration-500 cursor-pointer
        flex flex-col
        ${colSpan === 2 ? 'md:col-span-2' : ''}
        ${colSpan === 3 ? 'md:col-span-3' : ''}
        ${rowSpan === 2 ? 'row-span-2' : ''}
        ${className}
      `}
    >
      {/* Optional header area (image, illustration, etc.) */}
      {header && (
        <div className="relative overflow-hidden h-40 flex-shrink-0">
          {header}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {icon && (
          <div className="mb-3 text-3xl">{icon}</div>
        )}
        <h3 className="font-bold text-[#2a1f14] text-base tracking-tight mb-1 group-hover:text-[#c8882a] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] text-[#6b4e35] leading-relaxed font-light line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Subtle corner gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#c8882a]/5 via-transparent to-transparent rounded-[20px]" />
    </motion.div>
  );
}
