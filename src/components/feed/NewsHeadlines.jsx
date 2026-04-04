import { ExternalLink, Newspaper } from 'lucide-react'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NewsHeadlines({ sections }) {
  const newsSections = sections?.filter(s => s.type === 'news') || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Latest News</p>
      </div>

      {newsSections.map(section => {
        const d = section.data
        if (d?.news_unavailable) {
          return (
            <div key={section.crop} className="mb-4">
              <p className="text-xs font-bold text-black-forest capitalize mb-1">{section.crop}</p>
              <p className="text-xs text-ash">News unavailable.</p>
            </div>
          )
        }
        return (
          <div key={section.crop} className="mb-5 last:mb-0">
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3 capitalize">{section.crop}</p>
            <div className="space-y-3">
              {d?.headlines?.slice(0, 5).map((h, i) => (
                <a key={i} href={h.url} target="_blank" rel="noopener noreferrer"
                  className="block group">
                  <p className="text-sm font-semibold text-black-forest group-hover:text-forest transition-colors leading-snug line-clamp-2">
                    {h.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-ash">{h.source}</span>
                    <span className="text-[10px] text-ash/50">·</span>
                    <span className="text-[10px] text-ash">{timeAgo(h.published_at)}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-ash/40 group-hover:text-forest transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )
      })}

      {newsSections.length === 0 && (
        <p className="text-sm text-ash">No news sections available.</p>
      )}
    </div>
  )
}
