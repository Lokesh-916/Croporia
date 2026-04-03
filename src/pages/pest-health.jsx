import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function PestHealth() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [conditions, setConditions] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true); setError(''); setConditions([])
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('http://localhost:8000/plant-health', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) setError(data.detail || 'Plant health service error')
      else setConditions(data.conditions || [])
    } catch { setError('Cannot reach plant-health service on :8000') }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <section className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-2">Croporia - Pest & disease scanner</p>
          <h1 className="font-cinzel text-3xl font-black text-black-forest tracking-tight mb-2">Upload a plant photo.</h1>
          <p className="text-sm text-ash max-w-xl">Powered by the Plant.id health API. Use clear photos of affected leaves or fruits. This tool is guidance only.</p>
        </section>
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-olive/30 shadow-sm p-5 flex flex-col gap-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-ash">Plant image (leaf / fruit)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-ash file:mr-3 file:rounded-lg file:border-0 file:bg-black-forest file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:bg-forest" />
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            <button type="submit" disabled={loading || !file} className="inline-flex items-center justify-center rounded-xl bg-black-forest px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-forest disabled:opacity-60">
              {loading ? 'Analyzing...' : 'Check plant health'}
            </button>
            <p className="text-[11px] text-ash">Requires a valid <code className="rounded bg-frosted px-1.5 py-0.5 text-[10px] border border-olive/30">PLANT_ID_API_KEY</code> in your .env. Backend FastAPI service must be running on port 8000.</p>
          </form>
          <div className="bg-white rounded-2xl border border-olive/30 shadow-sm p-5 min-h-[220px] flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ash mb-3">Possible issues & treatments</p>
            {loading && <div className="flex items-center gap-3 text-sm text-ash"><div className="w-5 h-5 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /> Talking to Plant.id...</div>}
            {!loading && conditions.length === 0 && !error && <p className="text-sm text-ash">You will see likely pests / diseases here with suggested treatments once you upload a photo.</p>}
            {!loading && conditions.length > 0 && (
              <ul className="space-y-3 text-sm text-black-forest">
                {conditions.map(c => (
                  <li key={c.entity_id || c.name} className="border border-olive/20 rounded-xl p-3 bg-frosted/40">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-bold">{c.name}{c.local_name ? ` (${c.local_name})` : ''}</p>
                      <span className="text-[10px] font-semibold text-ash">{(c.probability * 100).toFixed(0)}% confidence</span>
                    </div>
                    {c.description && <p className="text-xs text-ash mb-2">{c.description}</p>}
                    <div className="grid gap-2 md:grid-cols-3 text-[11px] text-ash">
                      {c.treatment?.biological?.length > 0 && <div><p className="font-semibold text-forest mb-1">Biological</p><ul className="list-disc list-inside space-y-0.5">{c.treatment.biological.map(t => <li key={t}>{t}</li>)}</ul></div>}
                      {c.treatment?.chemical?.length > 0 && <div><p className="font-semibold text-copper mb-1">Chemical</p><ul className="list-disc list-inside space-y-0.5">{c.treatment.chemical.map(t => <li key={t}>{t}</li>)}</ul></div>}
                      {c.treatment?.prevention?.length > 0 && <div><p className="font-semibold text-ash mb-1">Prevention</p><ul className="list-disc list-inside space-y-0.5">{c.treatment.prevention.map(t => <li key={t}>{t}</li>)}</ul></div>}
                    </div>
                    {c.learn_more_url && <a href={c.learn_more_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-semibold text-forest underline underline-offset-4">Learn more</a>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
