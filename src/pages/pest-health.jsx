import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function PestHealth() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFile = (f) => {
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('http://localhost:8000/plant-health', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) setError(data.detail || 'Plant health service error')
      else setResult(data)
    } catch { setError('Cannot reach plant-health service on :8000') }
    finally { setLoading(false) }
  }

  const conditions = result?.conditions || []

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-8 pb-20">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-1">Croporia — Pest &amp; Disease Scanner</p>
          <h1 className="font-cinzel text-3xl text-black-forest mb-1">Identify pests &amp; diseases.</h1>
          <p className="text-sm text-ash">Upload a clear photo of an affected leaf or fruit. Powered by Plant.id AI.</p>
        </div>

        {/* Top row: upload + health status side by side */}
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 mb-8">

          {/* Upload card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-olive/20 shadow-sm p-5 flex flex-col gap-4 self-start">
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-olive/30 rounded-xl p-5 cursor-pointer hover:border-forest/50 hover:bg-frosted/20 transition-all min-h-[200px]">
              {preview
                ? <img src={preview} alt="preview" className="w-full max-h-52 object-contain rounded-lg" />
                : <>
                    <div className="w-14 h-14 rounded-2xl bg-frosted flex items-center justify-center text-3xl border border-olive/20">🌿</div>
                    <span className="text-sm text-ash font-medium text-center">Click to upload or drag &amp; drop</span>
                    <span className="text-[11px] text-ash/50">JPG, PNG, WEBP</span>
                  </>
              }
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0] || null)} />
            </label>

            {error && <p className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>}

            <button type="submit" disabled={loading || !file}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-forest disabled:opacity-50">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                : '🔍 Scan for Pests & Diseases'
              }
            </button>
          </form>

          {/* Health status + summary */}
          <div className="flex flex-col gap-4">
            {!result && !loading && (
              <div className="bg-white rounded-2xl border border-olive/20 p-8 flex flex-col items-center justify-center text-center min-h-[200px] gap-3">
                <div className="text-5xl">🔬</div>
                <p className="font-cinzel text-lg text-black-forest">Upload a plant photo to begin</p>
                <p className="text-sm text-ash max-w-sm">The AI will identify diseases, pests, and provide biological, chemical, and prevention treatments.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-olive/20 p-8 flex flex-col items-center justify-center min-h-[200px] gap-4">
                <div className="w-10 h-10 border-4 border-olive/20 border-t-forest rounded-full animate-spin" />
                <p className="text-sm text-ash font-medium">Analysing with Plant.id AI...</p>
              </div>
            )}

            {result && (
              <div className={`rounded-2xl border px-6 py-5 flex items-center gap-5 ${result.is_healthy ? 'bg-tea/60 border-forest/30' : 'bg-red-50 border-red-200'}`}>
                <span className="text-5xl">{result.is_healthy ? '✅' : '⚠️'}</span>
                <div>
                  <p className={`font-cinzel text-2xl ${result.is_healthy ? 'text-forest' : 'text-red-700'}`}>
                    {result.is_healthy ? 'Plant appears healthy' : `${conditions.length} issue${conditions.length !== 1 ? 's' : ''} detected`}
                  </p>
                  {result.is_healthy_probability != null && (
                    <p className="text-sm text-ash mt-1">
                      Healthy probability: <span className="font-bold">{(result.is_healthy_probability * 100).toFixed(1)}%</span>
                    </p>
                  )}
                  {conditions.length > 0 && (
                    <p className="text-sm text-ash mt-1">
                      Top finding: <span className="font-semibold text-black-forest">{conditions[0].name}</span>
                      {' '}— <span className="font-bold">{(conditions[0].probability * 100).toFixed(0)}%</span> confidence
                    </p>
                  )}
                </div>
              </div>
            )}

            {result && conditions.length === 0 && (
              <div className="bg-white rounded-2xl border border-olive/20 p-6 text-center text-forest font-medium">
                No significant diseases or pests detected.
              </div>
            )}
          </div>
        </div>

        {/* Conditions — full width cards */}
        {conditions.length > 0 && (
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ash">Detected conditions &amp; treatments</p>

            {conditions.map((c, i) => (
              <div key={c.entity_id || i} className="bg-white rounded-2xl border border-olive/20 shadow-sm overflow-hidden">

                {/* Card header — full width */}
                <div className="flex items-center gap-4 px-6 py-4 bg-frosted/50 border-b border-olive/20">
                  <div className="w-10 h-10 rounded-xl bg-black-forest text-white flex items-center justify-center font-cinzel font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-cinzel text-xl text-black-forest">{c.name}</h3>
                      {c.local_name && c.local_name !== c.name && (
                        <span className="text-sm text-ash">({c.local_name})</span>
                      )}
                      {c.classification?.map(cl => (
                        <span key={cl} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-vanilla border border-olive/30 text-ash uppercase tracking-wider">{cl}</span>
                      ))}
                    </div>
                    {c.common_names?.length > 0 && (
                      <p className="text-xs text-ash mt-0.5">Also known as: {c.common_names.join(', ')}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-cinzel font-bold text-black-forest">{(c.probability * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-ash uppercase tracking-wider">confidence</div>
                    <div className="w-24 bg-olive/20 rounded-full h-1.5 mt-1.5">
                      <div className="h-1.5 rounded-full bg-forest" style={{ width: `${(c.probability * 100).toFixed(0)}%` }} />
                    </div>
                  </div>
                </div>

                {/* Body — description + cause + similar images */}
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 border-b border-olive/10">
                  <div className="space-y-2">
                    {c.description && <p className="text-sm text-ash leading-relaxed">{c.description}</p>}
                    {c.cause && (
                      <p className="text-sm text-copper font-medium flex items-center gap-1.5">
                        <span className="text-base">🔬</span> Cause: {c.cause}
                      </p>
                    )}
                    {c.learn_more_url && (
                      <a href={c.learn_more_url} target="_blank" rel="noreferrer"
                        className="inline-block text-xs font-semibold text-forest underline underline-offset-4 mt-1">
                        Learn more →
                      </a>
                    )}
                  </div>
                  {c.similar_images?.length > 0 && (
                    <div className="shrink-0">
                      <p className="text-[10px] font-bold text-ash uppercase tracking-wider mb-2">Similar cases</p>
                      <div className="flex gap-2">
                        {c.similar_images.map((img, j) => img.url && (
                          <div key={j} className="relative">
                            <img src={img.url_small || img.url} alt="similar"
                              className="w-20 h-20 object-cover rounded-xl border border-olive/20" />
                            {img.similarity != null && (
                              <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md">
                                {(img.similarity * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Treatment — 3 columns full width */}
                {(c.treatment?.biological?.length > 0 || c.treatment?.chemical?.length > 0 || c.treatment?.prevention?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-olive/10">
                    {c.treatment.biological?.length > 0 && (
                      <div className="px-6 py-5">
                        <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <span>🌿</span> Biological
                        </p>
                        <ul className="space-y-2">
                          {c.treatment.biological.map((t, j) => (
                            <li key={j} className="flex gap-2 text-xs text-ash leading-relaxed">
                              <span className="text-forest mt-0.5 shrink-0">·</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {c.treatment.chemical?.length > 0 && (
                      <div className="px-6 py-5">
                        <p className="text-xs font-bold text-copper uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <span>⚗️</span> Chemical
                        </p>
                        <ul className="space-y-2">
                          {c.treatment.chemical.map((t, j) => (
                            <li key={j} className="flex gap-2 text-xs text-ash leading-relaxed">
                              <span className="text-copper mt-0.5 shrink-0">·</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {c.treatment.prevention?.length > 0 && (
                      <div className="px-6 py-5">
                        <p className="text-xs font-bold text-ash uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <span>🛡️</span> Prevention
                        </p>
                        <ul className="space-y-2">
                          {c.treatment.prevention.map((t, j) => (
                            <li key={j} className="flex gap-2 text-xs text-ash leading-relaxed">
                              <span className="mt-0.5 shrink-0">·</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
