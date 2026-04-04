import { Droplets } from 'lucide-react'

const URGENCY_STYLES = {
  high: 'bg-red-50 border-red-100 text-red-700',
  medium: 'bg-amber-50 border-amber-100 text-amber-700',
  low: 'bg-blue-50 border-blue-100 text-blue-700',
}

export default function IrrigationAdvisories({ sections }) {
  const irrigSections = sections?.filter(s => s.type === 'irrigation') || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Irrigation Advisories</p>
      </div>

      {irrigSections.map(section => {
        const d = section.data
        return (
          <div key={section.crop} className="mb-4 last:mb-0">
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-2 capitalize">{section.crop}</p>
            {d?.advisories?.map((adv, i) => (
              <div key={i} className={`rounded-xl p-3 border mb-2 last:mb-0 ${URGENCY_STYLES[adv.urgency] || URGENCY_STYLES.low}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{adv.urgency} urgency</span>
                </div>
                <p className="text-xs font-semibold leading-snug">{adv.text}</p>
                <p className="text-[11px] mt-1 opacity-75">{adv.recommended_action}</p>
              </div>
            ))}
          </div>
        )
      })}

      {irrigSections.length === 0 && (
        <p className="text-sm text-ash">No irrigation advisories available.</p>
      )}
    </div>
  )
}
