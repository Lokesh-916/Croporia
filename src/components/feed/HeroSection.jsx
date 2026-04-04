import { ExternalLink, Newspaper } from 'lucide-react'

export default function HeroSection({ alerts, news }) {
  const topAlert = alerts?.[0]
  // news is the full sections array — find first news section with headlines
  const newsSection = news?.find(s => s.type === 'news' && s.data?.headlines?.length > 0)
  const topNews = newsSection?.data?.headlines?.[0]

  if (topAlert) {
    return (
      <div className="bg-black-forest text-white rounded-2xl p-6 md:p-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-tea/70 mb-3 block">
          Breaking Alert
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-black leading-snug mb-3">
          {topAlert.message}
        </h2>
        <p className="text-sm text-white/60 mb-4">{topAlert.recommended_action}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            topAlert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
            topAlert.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {topAlert.severity} severity
          </span>
          <span className="text-[11px] text-white/40">{topAlert.affected_crop}</span>
        </div>
      </div>
    )
  }

  if (topNews) {
    return (
      <a href={topNews.url} target="_blank" rel="noopener noreferrer"
        className="block bg-black-forest text-white rounded-2xl p-6 md:p-8 hover:bg-forest transition-colors group">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-tea/60" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-tea/70">
            Top Story · {topNews.source}
          </span>
        </div>
        <h2 className="font-cinzel text-xl md:text-2xl font-black leading-snug mb-3 group-hover:text-tea transition-colors">
          {topNews.title}
        </h2>
        {topNews.description && (
          <p className="text-sm text-white/60 mb-4 line-clamp-2">{topNews.description}</p>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-tea/70">
          Read full story <ExternalLink className="w-3 h-3" />
        </span>
      </a>
    )
  }

  return (
    <div className="bg-frosted rounded-2xl p-6 border border-olive/20 flex items-center justify-center min-h-[120px]">
      <p className="text-sm text-ash font-medium">Loading today's top story...</p>
    </div>
  )
}
