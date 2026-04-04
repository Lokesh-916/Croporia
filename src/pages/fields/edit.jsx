import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const CROPS = [
  'Nothing yet / Fallow','Tomato','Brinjal','Okra','Chilli','Onion','Potato','Cauliflower',
  'Cabbage','Spinach','Bitter Gourd','Bottle Gourd','Carrot','Mango','Banana','Papaya',
  'Guava','Watermelon','Pomegranate','Coconut','Lemon','Rice','Wheat','Maize','Groundnut',
  'Sunflower','Soybean','Cotton','Sugarcane','Turmeric','Red Gram','Blackgram','Ginger','Garlic',
]
const SOIL_TYPES = ['Clay','Loamy','Sandy','Black (Regur)','Red','Laterite']
const WATER_OPTIONS = ['Borewell','Canal','Rain-fed','Tank / Pond','Drip']

const inp = 'w-full border border-olive/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest bg-white text-black-forest'
const sel = 'w-full border border-olive/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest bg-white text-black-forest'
const lbl = 'block text-[11px] font-bold text-ash uppercase tracking-widest mb-1.5'

export default function FieldEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', areaValue: '', areaUnit: 'Acres', location: '',
    soilType: '', soilPh: 6.5, nitrogen: '', phosphorus: '', potassium: '',
    waterSource: '', currentCrop: '', cropStatus: 'Planned', notes: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('croporia_token')
    if (!token) { navigate('/login'); return }
    fetch('http://localhost:5000/api/fields', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const field = Array.isArray(data) ? data.find(f => f._id === id) : null
        if (!field) { setError('Field not found'); setLoading(false); return }
        setForm({
          name: field.name || '',
          areaValue: field.area?.value || '',
          areaUnit: field.area?.unit || 'Acres',
          location: field.location || '',
          soilType: field.soilDetails?.type || '',
          soilPh: field.soilDetails?.ph || 6.5,
          nitrogen: field.soilDetails?.nitrogen || '',
          phosphorus: field.soilDetails?.phosphorus || '',
          potassium: field.soilDetails?.potassium || '',
          waterSource: field.waterSource || '',
          currentCrop: field.cropPlans?.[0]?.cropName || '',
          cropStatus: field.cropPlans?.[0]?.status || 'Planned',
          notes: field.notes || '',
        })
        setLoading(false)
      })
      .catch(() => { setError('Failed to load field'); setLoading(false) })
  }, [id, navigate])

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Field name is required'); return }
    const token = localStorage.getItem('croporia_token')
    setSaving(true); setError('')
    try {
      const payload = {
        name: form.name,
        area: { value: parseFloat(form.areaValue) || 1, unit: form.areaUnit },
        location: form.location,
        soilDetails: {
          type: form.soilType,
          ph: parseFloat(form.soilPh),
          nitrogen: form.nitrogen ? parseFloat(form.nitrogen) : undefined,
          phosphorus: form.phosphorus ? parseFloat(form.phosphorus) : undefined,
          potassium: form.potassium ? parseFloat(form.potassium) : undefined,
        },
        waterSource: form.waterSource,
        cropPlans: form.currentCrop ? [{ cropName: form.currentCrop, status: form.cropStatus }] : [],
        notes: form.notes,
      }
      const res = await fetch(`http://localhost:5000/api/fields/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (res.ok) { navigate(`/fields/${id}`) }
      else { const d = await res.json(); setError(d.error || 'Failed to save') }
    } catch { setError('Cannot connect to server') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-vanilla flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-olive/20 border-t-forest rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8 pb-20">
        <div className="flex items-center gap-2 text-[11px] text-ash mb-6 font-medium">
          <Link to="/fields" className="hover:text-forest">My Farm</Link>
          <span>/</span>
          <Link to={`/fields/${id}`} className="hover:text-forest">Field Details</Link>
          <span>/</span>
          <span className="text-black-forest">Edit</span>
        </div>

        <h1 className="font-cinzel text-2xl font-black text-black-forest mb-6">Edit Field</h1>

        <div className="bg-white rounded-2xl border border-olive/20 p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Field Name *</label>
              <input className={inp} value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. North Field" />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input className={inp} value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} placeholder="e.g. Guntur, AP" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Area</label>
              <div className="flex gap-2">
                <input type="number" className={inp} value={form.areaValue} onChange={e => setForm(p => ({...p, areaValue: e.target.value}))} placeholder="0.0" step="0.1" />
                <select className="border border-olive/40 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-forest" value={form.areaUnit} onChange={e => setForm(p => ({...p, areaUnit: e.target.value}))}>
                  <option>Acres</option><option>Guntas</option><option>Hectares</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Water Source</label>
              <select className={sel} value={form.waterSource} onChange={e => setForm(p => ({...p, waterSource: e.target.value}))}>
                <option value="">— Select —</option>
                {WATER_OPTIONS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Soil Type</label>
              <select className={sel} value={form.soilType} onChange={e => setForm(p => ({...p, soilType: e.target.value}))}>
                <option value="">— Select —</option>
                {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Soil pH — {parseFloat(form.soilPh).toFixed(1)}</label>
              <input type="range" min="4" max="9" step="0.1" className="w-full mt-2 accent-forest" value={form.soilPh} onChange={e => setForm(p => ({...p, soilPh: e.target.value}))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['Nitrogen (N)', 'nitrogen'], ['Phosphorus (P)', 'phosphorus'], ['Potassium (K)', 'potassium']].map(([label, key]) => (
              <div key={key}>
                <label className={lbl}>{label}</label>
                <input type="number" className={inp} value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} placeholder="kg/acre" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Current Crop</label>
              <select className={sel} value={form.currentCrop} onChange={e => setForm(p => ({...p, currentCrop: e.target.value}))}>
                <option value="">— None —</option>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Crop Status</label>
              <select className={sel} value={form.cropStatus} onChange={e => setForm(p => ({...p, cropStatus: e.target.value}))}>
                <option>Planned</option><option>Sowed</option><option>Harvested</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Notes</label>
            <textarea className={inp + ' resize-none'} rows={3} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Any notes about this field..." />
          </div>

          {error && <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
        </div>

        <div className="flex items-center justify-between mt-5">
          <Link to={`/fields/${id}`} className="px-6 py-2.5 rounded-xl border border-olive/40 text-sm font-bold text-ash bg-white hover:bg-frosted transition-all">
            Cancel
          </Link>
          <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded-xl bg-black-forest text-white text-sm font-bold hover:bg-forest transition-all disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
