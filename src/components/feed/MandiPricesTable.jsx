import { TrendingUp } from 'lucide-react'

export default function MandiPricesTable({ sections }) {
  const priceData = sections?.filter(s => s.type === 'mandi_prices') || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-forest" />
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest">Mandi Prices</p>
      </div>

      {priceData.length === 0 && (
        <p className="text-sm text-ash">No price data available.</p>
      )}

      {priceData.map(section => {
        const d = section.data
        if (d?.prices_unavailable) {
          return (
            <div key={section.crop} className="mb-4">
              <p className="text-xs font-bold text-black-forest capitalize mb-1">{section.crop}</p>
              <p className="text-xs text-ash">Price data unavailable.</p>
            </div>
          )
        }
        return (
          <div key={section.crop} className="mb-5 last:mb-0">
            <p className="text-xs font-bold text-forest uppercase tracking-wide mb-2 capitalize">{section.crop}</p>
            {d?.entries?.length === 0 && <p className="text-xs text-ash">No mandi records found.</p>}
            <div className="space-y-2">
              {d?.entries?.slice(0, 5).map((e, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-olive/10 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-black-forest truncate">{e.mandi_name || 'Mandi'}</p>
                    <p className="text-[10px] text-ash">{e.state} · {e.price_date}</p>
                  </div>
                  <span className="text-sm font-black text-forest shrink-0">₹{e.price_per_quintal}</span>
                </div>
              ))}
            </div>
            {d?.entries?.length > 0 && (
              <p className="text-[10px] text-ash mt-2">per quintal · sorted by latest</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
