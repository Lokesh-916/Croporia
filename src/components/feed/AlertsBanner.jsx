import { useState } from 'react'
import { AlertTriangle, X, CloudRain, Bug } from 'lucide-react'

const SEVERITY_STYLES = {
  high: 'bg-red-50 border-red-200 text-red-800',
  medium: 'bg-amber-50 border-amber-200 text-amber-800',
  low: 'bg-blue-50 border-blue-200 text-blue-800',
}

const SEVERITY_BADGE = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
}

export default function AlertsBanner({ alerts }) {
  const [dismissed, setDismissed] = useState(false)
  if (!alerts?.length || dismissed) return null

  const top = alerts[0]
  const Icon = top.type === 'weather' ? CloudRain : Bug

  return (
    <div className={`border rounded-2xl px-5 py-4 flex items-start gap-4 ${SEVERITY_STYLES[top.severity] || SEVERITY_STYLES.medium}`}>
      <div className="mt-0.5 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${SEVERITY_BADGE[top.severity]}`}>
            {top.severity} alert
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{top.type}</span>
          {alerts.length > 1 && (
            <span className="text-[10px] font-semibold opacity-60">+{alerts.length - 1} more</span>
          )}
        </div>
        <p className="text-sm font-semibold leading-snug">{top.message}</p>
        {top.recommended_action && (
          <p className="text-xs mt-1 opacity-75">{top.recommended_action}</p>
        )}
      </div>
      <button onClick={() => setDismissed(true)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
