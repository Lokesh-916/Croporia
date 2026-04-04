import { Landmark, ExternalLink } from 'lucide-react'

export default function GovtSchemes({ sections }) {
  const schemeSections = sections?.filter(s => s.type === 'schemes') || []
  const allSchemes = schemeSections.flatMap(s => (s.data?.schemes || []).map(sc => ({ ...sc, crop: s.crop })))

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Landmark className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Govt Schemes & Subsidies</p>
      </div>

      {allSchemes.length === 0 && (
        <p className="text-sm text-ash">No scheme data available right now.</p>
      )}

      <div className="space-y-3">
        {allSchemes.slice(0, 5).map((scheme, i) => (
          <div key={i} className="border border-olive/20 rounded-xl p-3 hover:border-forest/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-black-forest line-clamp-1">{scheme.name}</p>
                <p className="text-[10px] text-forest/70 font-semibold uppercase tracking-wide mt-0.5 capitalize">{scheme.crop}</p>
              </div>
              {scheme.url && (
                <a href={scheme.url} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 text-ash/40 hover:text-forest transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-ash mt-1.5 leading-relaxed line-clamp-2">{scheme.description}</p>
            <p className="text-[10px] text-ash/60 mt-1">Eligibility: {scheme.eligibility}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
