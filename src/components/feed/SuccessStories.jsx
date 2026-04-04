import { Star, ExternalLink } from 'lucide-react'

export default function SuccessStories({ sections }) {
  const storySections = sections?.filter(s => s.type === 'success_stories') || []
  const allStories = storySections.flatMap(s => (s.data?.stories || []).map(st => ({ ...st, crop: s.crop })))

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Success Stories</p>
      </div>

      {allStories.length === 0 && (
        <div className="space-y-3">
          {[
            { title: "How a farmer doubled income with intercropping", summary: "Farmers across India are combining crops like maize with pulses to maximise yield per acre and reduce input costs.", url: "https://thebetterindia.com" },
            { title: "Drip irrigation transforms small farm profitability", summary: "Adopting micro-irrigation helped farmers in Andhra Pradesh cut water use by 40% while increasing crop yield.", url: "https://krishijagran.com" },
          ].map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="block border-l-2 border-forest/30 pl-3 hover:border-forest transition-colors group">
              <p className="text-xs font-bold text-black-forest group-hover:text-forest transition-colors">{s.title}</p>
              <p className="text-[11px] text-ash mt-0.5 line-clamp-2 leading-relaxed">{s.summary}</p>
            </a>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {allStories.slice(0, 4).map((story, i) => (
          <a key={i} href={story.url} target="_blank" rel="noopener noreferrer"
            className="block border-l-2 border-forest/30 pl-3 hover:border-forest transition-colors group">
            <p className="text-xs font-bold text-black-forest group-hover:text-forest transition-colors line-clamp-1">
              {story.title}
            </p>
            <p className="text-[11px] text-ash mt-0.5 line-clamp-2 leading-relaxed">{story.summary}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-forest/60 font-semibold capitalize">{story.crop}</span>
              <ExternalLink className="w-2.5 h-2.5 text-ash/40" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
