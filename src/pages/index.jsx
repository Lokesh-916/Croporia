import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="grain-bg min-h-screen flex items-center justify-center px-4 py-10">
      <main className="glass-card max-w-6xl w-full mx-auto px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="chip-soft">
                <span className="text-xs">🌾</span>
                New‑age farming companion
              </span>
            </div>
            <p className="heading-script text-4xl sm:text-5xl lg:text-6xl text-emerald-800 mb-3">
              Croporia
            </p>
            <h1 className="heading-sans text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
              One place for crop knowledge, expert guidance, and field tracking.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-600 mb-7">
              Learn what to grow, when to grow it, and how to protect it. Move from scattered notes
              and WhatsApp forwards to a clear, trusted assistant that stays with you from soil
              prep to harvest.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link to="/crops" className="btn-primary">
                Explore crop wiki
                <span aria-hidden>→</span>
              </Link>
              <Link to="/fields" className="btn-secondary">
                Plan my fields
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Smart learning lessons
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Talk‑to‑experts UI ready
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Plant health API backend
              </span>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-emerald-100/70 bg-white/90 px-4 py-3">
              <p className="text-xs font-medium text-emerald-700 mb-1">Quick entry points</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/community"
                  className="rounded-xl border border-emerald-50 bg-emerald-50/80 px-3 py-2 text-emerald-900 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                >
                  <p className="font-semibold mb-0.5">Community</p>
                  <p className="text-[11px] text-emerald-900/80">
                    Share updates, questions, and local wisdom.
                  </p>
                </Link>
                <Link
                  to="/practices"
                  className="rounded-xl border border-amber-50 bg-amber-50/80 px-3 py-2 text-amber-900 hover:border-amber-200 hover:bg-amber-50 transition-colors"
                >
                  <p className="font-semibold mb-0.5">Best practices</p>
                  <p className="text-[11px] text-amber-900/80">
                    Step‑by‑step guides for soil, water, and pests.
                  </p>
                </Link>
                <Link
                  to="/crops"
                  className="rounded-xl border border-emerald-50 bg-white px-3 py-2 text-slate-900 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors col-span-2"
                >
                  <p className="font-semibold mb-0.5">Smart learning (courses)</p>
                  <p className="text-[11px] text-slate-600">
                    Structured lessons from sowing to harvest, built to plug into Croporia.
                  </p>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">
                What&apos;s wired today?
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• React 19 + Vite + Tailwind 4 unified under Inter &amp; Pacifico fonts.</li>
                <li>• Node/Express backend for auth, fields, and community.</li>
                <li>• Python FastAPI backend for RAG answers and plant health checks.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
