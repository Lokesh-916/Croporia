import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import AlertsBanner from '../components/feed/AlertsBanner'
import FeedHeader from '../components/feed/FeedHeader'
import FeedSkeleton from '../components/feed/FeedSkeleton'
import HeroSection from '../components/feed/HeroSection'
import WeatherWidget from '../components/feed/WeatherWidget'
import MandiPricesTable from '../components/feed/MandiPricesTable'
import NewsHeadlines from '../components/feed/NewsHeadlines'
import InnovationsGrid from '../components/feed/InnovationsGrid'
import DemandInsights from '../components/feed/DemandInsights'
import GovtSchemes from '../components/feed/GovtSchemes'
import RagInsights from '../components/feed/RagInsights'
import SuccessStories from '../components/feed/SuccessStories'
import IrrigationAdvisories from '../components/feed/IrrigationAdvisories'
import AgriEvents from '../components/feed/AgriEvents'

const NODE_API = 'http://localhost:5000/api'
const PYTHON_API = 'http://localhost:8000'
const SKIP_CROPS = new Set(['fallow', 'nothing yet', 'nothing yet / fallow', 'n/a', 'none', ''])

export default function FeedPage() {
  const navigate = useNavigate()
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadFeed = useCallback(async (bustCache = false) => {
    const token = localStorage.getItem('croporia_token')
    if (!token) { navigate('/login'); return }

    bustCache ? setRefreshing(true) : setLoading(true)
    setError('')

    try {
      if (bustCache) {
        await fetch(`${PYTHON_API}/feed/cache`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {})
      }

      const fieldsRes = await fetch(`${NODE_API}/fields`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!fieldsRes.ok) throw new Error('Could not load your fields.')
      const fields = await fieldsRes.json()

      const crops = []
      const seen = new Set()
      for (const field of fields) {
        for (const plan of field.cropPlans || []) {
          const name = plan.cropName?.trim()
          if (name && !SKIP_CROPS.has(name.toLowerCase()) && !seen.has(name.toLowerCase())) {
            crops.push(name)
            seen.add(name.toLowerCase())
          }
        }
      }

      if (crops.length === 0) {
        navigate('/fields/new?reason=feed_requires_crops')
        return
      }

      const location = fields[0]?.location || 'India'

      const feedRes = await fetch(
        `${PYTHON_API}/feed?crops=${encodeURIComponent(crops.join(','))}&location=${encodeURIComponent(location)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (feedRes.status === 403) { navigate('/fields/new?reason=feed_requires_crops'); return }
      if (!feedRes.ok) throw new Error('Feed service unavailable. Make sure the Python backend is running on port 8000.')

      setFeed(await feedRes.json())
    } catch (e) {
      setError(e.message || 'Failed to load your feed.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [navigate])

  useEffect(() => { loadFeed() }, [loadFeed])

  const sections = feed?.sections || []
  const weatherData = sections.find(s => s.type === 'weather')?.data
  const newsSections = sections.filter(s => s.type === 'news')

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 pb-16">

        {loading && <FeedSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-sm text-red-700 font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && feed && (
          <>
            {feed.alerts?.length > 0 && (
              <div className="mb-5"><AlertsBanner alerts={feed.alerts} /></div>
            )}

            {/* Masthead + refresh button */}
            <div className="flex items-start justify-between gap-4 mb-0">
              <div className="flex-1"><FeedHeader meta={feed.meta} /></div>
              <button
                onClick={() => loadFeed(true)}
                disabled={refreshing}
                className="shrink-0 mt-1 flex items-center gap-1.5 text-[11px] font-bold text-ash hover:text-forest border border-olive/30 hover:border-forest px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                title="Refresh feed (clears today's cache)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* ── NEWSPAPER GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5">

              {/* LEFT: 3 cols */}
              <div className="lg:col-span-3 space-y-5">
                <HeroSection alerts={feed.alerts} news={sections} />

                {/* Row 2: Irrigation (time-sensitive) + Demand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <IrrigationAdvisories sections={sections} />
                  <DemandInsights sections={sections} />
                </div>

                {/* Row 3: Innovations + News */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InnovationsGrid sections={sections} />
                  <NewsHeadlines sections={sections} />
                </div>

                {/* Row 4: Govt Schemes + Success Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <GovtSchemes sections={sections} />
                  <SuccessStories sections={sections} />
                </div>

                {/* Row 5: Agri Events */}
                <AgriEvents sections={sections} />
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="lg:col-span-1 space-y-5">
                <WeatherWidget data={weatherData} />
                <MandiPricesTable sections={sections} />
                <RagInsights sections={sections} />
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}
