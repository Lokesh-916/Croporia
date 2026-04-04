import { Calendar, ExternalLink } from 'lucide-react'

export default function AgriEvents({ sections }) {
  const eventsSection = sections?.find(s => s.type === 'events')
  const events = eventsSection?.data?.events || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Agri Events</p>
      </div>

      {events.length === 0 && (
        <p className="text-sm text-ash">No upcoming events found.</p>
      )}

      <div className="space-y-3">
        {events.map((event, i) => (
          <a key={i} href={event.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 group hover:bg-frosted/50 rounded-xl p-2 -mx-2 transition-colors">
            <div className="shrink-0 w-10 h-10 bg-frosted rounded-xl flex items-center justify-center border border-olive/20">
              <Calendar className="w-4 h-4 text-forest" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-black-forest group-hover:text-forest transition-colors line-clamp-1">
                {event.name}
              </p>
              <p className="text-[10px] text-ash mt-0.5">{event.location} · {event.date}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-ash/30 shrink-0 mt-0.5 group-hover:text-forest transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
