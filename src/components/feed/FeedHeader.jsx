import { Newspaper, RefreshCw } from 'lucide-react'

export default function FeedHeader({ meta }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="border-b-2 border-black-forest pb-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-forest" />
          <div>
            <h1 className="font-cinzel font-black text-2xl md:text-3xl text-black-forest tracking-tight leading-none">
              Croporia Daily
            </h1>
            <p className="text-[11px] font-semibold text-ash uppercase tracking-[0.18em] mt-0.5">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {meta?.crops?.map(crop => (
            <span key={crop} className="text-[11px] font-bold px-3 py-1 rounded-full bg-frosted text-forest border border-olive/30 uppercase tracking-wide">
              {crop}
            </span>
          ))}
          {meta?.season && (
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-vanilla text-ash border border-cream">
              {meta.season}
            </span>
          )}
          {meta?.cached && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-ash/60 border border-olive/20 px-2 py-1 rounded-full">
              <RefreshCw className="w-3 h-3" />
              Today's edition
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
