import { Lightbulb, ExternalLink } from 'lucide-react'

export default function InnovationsGrid({ sections }) {
  const innovSections = sections?.filter(s => s.type === 'innovations') || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Innovations & World Usage</p>
      </div>

      {innovSections.map(section => {
        const d = section.data
        if (d?.innovations_unavailable) {
          return (
            <div key={section.crop} className="mb-4">
              <p className="text-xs font-bold text-black-forest capitalize mb-1">{section.crop}</p>
              <p className="text-xs text-ash">Innovation data unavailable.</p>
            </div>
          )
        }
        return (
          <div key={section.crop} className="mb-5 last:mb-0">
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3 capitalize">{section.crop}</p>
            <div className="space-y-3">
              {d?.items?.slice(0, 5).map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-frosted/50 rounded-xl p-3 border border-olive/10 hover:border-forest/30 hover:bg-frosted transition-all group">
                  <p className="text-xs font-bold text-black-forest group-hover:text-forest transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-ash leading-relaxed line-clamp-2">{item.summary}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-forest/60 mt-1.5">
                    Read more <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )
      })}

      {innovSections.length === 0 && (
        <p className="text-sm text-ash">No innovation data available.</p>
      )}
    </div>
  )
}
