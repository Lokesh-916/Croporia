import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Assistant() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true); setError(''); setAnswer('')
    try {
      const res = await fetch('http://localhost:8000/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
      const data = await res.json()
      if (!res.ok) setError(data.detail || 'Assistant error')
      else setAnswer(data.answer || '')
    } catch { setError('Cannot reach RAG service on :8000') }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <section className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-2">Croporia - Farm assistant</p>
          <h1 className="font-cinzel text-3xl font-black text-black-forest tracking-tight mb-2">Ask about your crops.</h1>
          <p className="text-sm text-ash max-w-xl">Questions are answered using your Farming_Data_RAG.md knowledge base. Keep questions specific to crops, seasons and practices.</p>
        </section>
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          <form onSubmit={handleAsk} className="bg-white rounded-2xl border border-olive/30 shadow-sm p-5 flex flex-col gap-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.22em] text-ash">Your question</label>
            <textarea rows="4" className="w-full resize-none rounded-xl border border-olive/40 bg-frosted/50 px-4 py-3 text-sm font-medium text-black-forest outline-none focus:border-forest focus:ring-2 focus:ring-forest/15" placeholder="e.g. I have 2 acres of samba rice on clay soil. How often should I irrigate during tillering stage?" value={question} onChange={e => setQuestion(e.target.value)} />
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl bg-black-forest px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-forest disabled:opacity-70">
              {loading ? 'Thinking...' : 'Ask assistant'}
            </button>
          </form>
          <div className="bg-white rounded-2xl border border-olive/30 shadow-sm p-5 min-h-[220px] flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ash mb-3">Assistant answer</p>
            {loading && <div className="flex items-center gap-3 text-sm text-ash"><div className="w-5 h-5 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /> Thinking...</div>}
            {!loading && !answer && !error && <p className="text-sm text-ash">You will see concise, field-ready guidance here once you ask something.</p>}
            {!loading && answer && <p className="text-sm text-black-forest leading-relaxed whitespace-pre-line">{answer}</p>}
          </div>
        </section>
      </main>
    </div>
  )
}
