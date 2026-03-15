import React from 'react'

interface IntuitionBoxProps {
  children: React.ReactNode
  className?: string
}

export default function IntuitionBox({ children, className = '' }: IntuitionBoxProps) {
  return (
    <div
      className={`rounded-xl border-2 border-primary/40 bg-leaf/10 p-4 text-soil border-l-4 border-l-primary ${className}`}
      role="complementary"
      aria-label="Key intuition"
    >
      <p className="text-sm font-medium text-primary mb-1">💡 Intuition</p>
      <p className="text-soil text-sm leading-relaxed">{children}</p>
    </div>
  )
}
