import { useState } from 'react'
import { Brain, ChevronDown, ChevronUp } from 'lucide-react'

export default function RagInsights({ sections }) {
  const ragSections = sections?.filter(s => s.type === 'rag_insights') || []
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Smart Insights</p>
        <span className="text-[9px] font-bold bg-frosted text-forest border border-olive/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide ml-auto">AI</span>
      </div>

      {ragSections.map(section => {
        const d = section.data
        if (d?.insights_unavailable) {
          return (
            <div key={section.crop}>
              <p className="text-xs font-bold text-forest uppercase tracking-wide mb-1 capitalize">{section.crop}</p>
              <p className="text-xs text-ash">AI insights unavailable.</p>
            </div>
          )
        }
        return (
          <div key={section.crop}>
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3 capitalize">{section.crop}</p>
            {d?.insights?.map((insight, i) => {
              // Split into bullet points if the text has them
              const text = insight.text || ''
              const lines = text.split('\n').filter(l => l.trim())
              const preview = lines.slice(0, 4)
              const rest = lines.slice(4)

              return (
                <div key={i} className="bg-frosted/60 rounded-xl p-4 border border-olive/10">
                  <div className="space-y-1.5">
                    {preview.map((line, j) => (
                      <p key={j} className="text-xs text-black-forest leading-relaxed">{line}</p>
                    ))}
                    {expanded && rest.map((line, j) => (
                      <p key={j} className="text-xs text-black-forest leading-relaxed">{line}</p>
                    ))}
                  </div>
                  {rest.length > 0 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="flex items-center gap-1 text-[10px] font-bold text-forest mt-3 hover:text-black-forest transition-colors"
                    >
                      {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show {rest.length} more lines</>}
                    </button>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-olive/20 rounded-full overflow-hidden">
                      <div className="h-full bg-forest rounded-full" style={{ width: `${(insight.confidence || 0.85) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-ash shrink-0">{Math.round((insight.confidence || 0.85) * 100)}% confidence</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {ragSections.length === 0 && (
        <p className="text-sm text-ash">No AI insights available.</p>
      )}
    </div>
  )
}
