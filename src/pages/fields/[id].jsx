import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'

export default function FieldDetail() {
  const { id } = useParams()
  const [field, setField] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('croporia_token')
    if (!token) { setLoading(false); return }
    fetch('http://localhost:5000/api/fields', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setField(data.find(f => f._id === id) || null) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen bg-vanilla flex items-center justify-center"><div className="w-8 h-8 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /></div>
  if (!field) return (
    <div className="min-h-screen bg-vanilla font-sans"><Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-cinzel text-2xl font-bold text-black-forest mb-4">Field not found</p>
        <Link to="/fields" className="text-forest font-semibold underline">Back to My Fields</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Link to="/fields" className="text-sm text-forest font-semibold hover:underline">← Back to My Fields</Link>
          <Link to={`/fields/${id}/edit`} className="px-4 py-2 bg-black-forest text-white text-sm font-bold rounded-xl hover:bg-forest transition-colors">Edit Field</Link>
        </div>
        <div className="bg-white rounded-3xl border border-olive/30 shadow-sm overflow-hidden">
          <div className="h-2 bg-forest" />
          <div className="p-8">
            <h1 className="font-cinzel text-3xl font-black text-black-forest mb-6">{field.name || 'Unnamed Field'}</h1>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ['Area', `${field.area?.value} ${field.area?.unit}`],
                ['Location', field.location || '—'],
                ['Soil Type', field.soilDetails?.type || '—'],
                ['Soil pH', field.soilDetails?.ph || '—'],
              ].map(([label, val]) => (
                <div key={label} className="bg-frosted rounded-xl p-4 border border-olive/20">
                  <p className="text-[10px] font-bold text-ash uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm font-semibold text-black-forest">{val}</p>
                </div>
              ))}
            </div>
            {field.cropPlans?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-ash uppercase tracking-widest mb-3">Crop Plans</p>
                <div className="space-y-2">
                  {field.cropPlans.map((plan, i) => (
                    <div key={i} className="flex items-center justify-between bg-vanilla rounded-xl px-4 py-3 border border-cream">
                      <span className="text-sm font-semibold text-black-forest">{plan.cropName}</span>
                      <span className="text-xs font-bold px-3 py-1 bg-frosted text-forest rounded-full border border-olive/30">{plan.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
