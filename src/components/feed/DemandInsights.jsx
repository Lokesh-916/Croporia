import { TrendingUp, TrendingDown, Minus, BarChart2, ExternalLink } from 'lucide-react'

const TREND_CONFIG = {
  rising: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Rising' },
  falling: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', label: 'Falling' },
  stable: { icon: Minus, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Stable' },
}

export default function DemandInsights({ sections }) {
  const demandSections = sections?.filter(s => s.type === 'demand') || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Demand Insights</p>
      </div>

      {demandSections.map(section => {
        const d = section.data
        if (d?.demand_unavailable) {
          return (
            <div key={section.crop} className="mb-4">
              <p className="text-xs font-bold text-black-forest capitalize mb-1">{section.crop}</p>
              <p className="text-xs text-ash">Demand data unavailable.</p>
            </div>
          )
        }
        return (
          <div key={section.crop} className="mb-5 last:mb-0">
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3 capitalize">{section.crop}</p>
            <div className="space-y-2">
              {d?.entries?.slice(0, 4).map((entry, i) => {
                const cfg = TREND_CONFIG[entry.trend] || TREND_CONFIG.stable
                const Icon = cfg.icon
                return (
                  <div key={i} className={`rounded-xl p-3 ${cfg.bg} border border-transparent`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-[10px] text-ash ml-auto">{entry.region}</span>
                    </div>
                    <p className="text-xs text-ash leading-relaxed line-clamp-2">{entry.snippet}</p>
                    {entry.url && (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-forest/60 mt-1">
                        Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {demandSections.length === 0 && (
        <p className="text-sm text-ash">No demand data available.</p>
      )}
    </div>
  )
}
