import React from 'react'

export type DiagramType = 'soil-layers' | 'soil-texture' | 'organic-matter' | 'seasons' | 'irrigation-flow' | 'pest-damage' | 'economics'

interface DiagramProps {
  type: DiagramType
  className?: string
}

const placeholderStyles = 'rounded-xl border-2 border-leaf/30 bg-leaf/5 flex items-center justify-center text-soil/70 text-sm font-medium'

export default function Diagram({ type, className = '' }: DiagramProps) {
  const titles: Record<DiagramType, string> = {
    'soil-layers': 'Soil layers (topsoil → subsoil → bedrock)',
    'soil-texture': 'Sand / Silt / Clay balance',
    'organic-matter': 'Organic matter in soil',
    seasons: 'Kharif & Rabi seasons',
    'irrigation-flow': 'Water flow in soil',
    'pest-damage': 'Signs of pest damage',
    economics: 'Costs & returns',
  }

  return (
    <div
      className={`min-h-[180px] sm:min-h-[220px] ${placeholderStyles} ${className}`}
      aria-label={`Diagram: ${titles[type]}`}
    >
      <div className="text-center px-4">
        <span className="block text-4xl mb-2 opacity-60">
          {type === 'soil-layers' && '📚'}
          {type === 'soil-texture' && '⚖️'}
          {type === 'organic-matter' && '🍂'}
          {type === 'seasons' && '📅'}
          {type === 'irrigation-flow' && '💧'}
          {type === 'pest-damage' && '🦗'}
          {type === 'economics' && '📊'}
        </span>
        <span>{titles[type]}</span>
        <span className="block text-xs mt-1">(Diagram placeholder)</span>
      </div>
    </div>
  )
}
