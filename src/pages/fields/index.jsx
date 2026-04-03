import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

function FieldCard({ field }) {
  return (
    <div className="bg-white rounded-2xl border border-olive/30 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col">
      <div className="h-2 w-full bg-forest" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-cinzel font-bold text-lg text-black-forest mb-3">{field.name || 'Unnamed Field'}</h3>
          <div className="flex items-center gap-4 text-sm text-ash">
            <span className="text-xs">{field.area?.value} {field.area?.unit}</span>
            <span className="text-xs">{field.soilDetails?.type || 'Unknown soil'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {field.cropPlans?.length > 0 && field.cropPlans[0].cropName !== 'Fallow' && (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-frosted text-forest border border-olive/30">{field.cropPlans[0].status}: {field.cropPlans[0].cropName}</span>
          )}
          {field.location && <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-vanilla text-ash border border-cream">{field.location}</span>}
        </div>
        <div className="mt-auto pt-4 border-t border-olive/20 flex items-center justify-between">
          <Link to={`/fields/${field._id || field.id}`} className="text-[12px] font-bold text-forest hover:underline">View Details</Link>
          <Link to={`/fields/${field._id || field.id}/edit`} className="text-[12px] font-medium text-ash hover:text-black-forest">Edit</Link>
        </div>
      </div>
    </div>
  )
}

export default function MyFields() {
  const [fields, setFields] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('croporia_token')
    if (!token) { setFields([]); return }
    fetch('http://localhost:5000/api/fields', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { if (Array.isArray(data)) setFields(data) })
      .catch(() => setFields([]))
  }, [])

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <section className="bg-frosted border-b border-olive/30">
        <div className="max-w-5xl mx-auto px-8 py-10 flex items-center justify-between gap-8">
          <div>
            <p className="text-[11px] font-bold text-forest uppercase tracking-[0.22em] mb-2">Croporia - My Farm</p>
            <h1 className="font-cinzel text-4xl font-black text-black-forest mb-2">My Fields</h1>
            <p className="text-sm text-ash max-w-md leading-relaxed">Just sowed your field? Register it here and we will help you track and manage it.</p>
          </div>
          <Link to="/fields/new" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black-forest text-white text-sm font-bold hover:bg-forest transition-colors shadow-sm">+ Register New Field</Link>
        </div>
      </section>
      <main className="max-w-5xl mx-auto px-8 py-8 pb-20">
        {!mounted ? null : fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-olive/40 text-center">
            <div className="w-16 h-16 bg-frosted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-olive/30"><span className="font-cinzel font-black text-forest text-xl">0</span></div>
            <h2 className="font-cinzel text-xl font-black text-black-forest mb-2">No fields registered yet.</h2>
            <p className="text-ash text-sm max-w-xs mb-6">Add your first field to get personalized crop recommendations.</p>
            <Link to="/fields/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black-forest text-white text-sm font-bold hover:bg-forest transition-colors">+ Register Your First Field</Link>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-ash mb-6">{fields.length} field{fields.length > 1 ? 's' : ''} registered</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{fields.map(f => <FieldCard key={f._id} field={f} />)}</div>
          </>
        )}
      </main>
    </div>
  )
}
