import React from 'react'

interface ProgressBarProps {
  percent: number
  label?: string
  showCount?: boolean
  completed?: number
  total?: number
  className?: string
}

export default function ProgressBar({
  percent,
  label,
  showCount,
  completed = 0,
  total = 0,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className={`w-full ${className}`}>
      {(label || showCount) && (
        <div className="flex justify-between text-sm text-soil/80 mb-1">
          {label && <span>{label}</span>}
          {showCount && total > 0 && (
            <span>
              {completed}/{total}
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-soil/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
