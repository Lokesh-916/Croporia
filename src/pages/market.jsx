import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const API = 'http://localhost:5000/api/market'
const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Crops', 'Herbs & Spices']

export default function Market() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [pincode, setPincode] = useState('')
  const [contactListing, setContactListing] = useState(null)
  const [showSell, setShowSell] = useState(false)
  const [contactForm, setContactForm] = useState({ buyerName: '', buyerPhone: '', message: '' })
  const [contactStatus, setContactStatus] = useState('')
  const [sellForm, setSellForm] = useState({ farmerName: '', category: 'Vegetables', cropName: '', pincode: '', amountKg: '', pricePerKg: '' })
  const [sellLoading, setSellLoading] = useState(false)
  const [sellError, setSellError] = useState('')

  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')
  const token = localStorage.getItem('croporia_token')

  const fetchListings = async () => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams()
      if (category !== 'All') params.append('category', category)
      if (pincode.trim().length === 6) params.append('pincode', pincode.trim())
      const res = await fetch(`${API}/listings?${params}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch { setError('Cannot reach server. Make sure the Node.js backend is running on port 5000.') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return
    try {
      await fetch(`${API}/listings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setListings(prev => prev.filter(l => l._id !== id))
    } catch { alert('Could not delete listing.') }
  }

  const handleContact = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: contactListing._id, ...contactForm }) })
      setContactStatus(res.ok ? 'success' : 'error')
    } catch { setContactStatus('error') }
  }

  const handleSell = async (e) => {
    e.preventDefault(); setSellLoading(true); setSellError('')
    try {
      const res = await fetch(`${API}/listings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...sellForm, amountKg: Number(sellForm.amountKg), pricePerKg: Number(sellForm.pricePerKg) }) })
      const data = await res.json()
      if (res.ok) { setListings(prev => [data, ...prev]); setShowSell(false); setSellForm({ farmerName: '', category: 'Vegetables', cropName: '', pincode: '', amountKg: '', pricePerKg: '' }) }
      else setSellError(data.error || 'Failed to post listing')
    } catch { setSellError('Cannot reach server') }
    finally { setSellLoading(false) }
  }

  useEffect(() => { fetchListings() }, [category, pincode])

  const inp = "w-full border border-olive/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest bg-frosted/30"

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-2">Croporia - Market</p>
            <h1 className="font-cinzel text-3xl font-black text-black-forest tracking-tight mb-1">Sell & Buy Crops</h1>
            <p className="text-sm text-ash max-w-xl">Connect directly with farmers in your area. List excess produce or find fresh crops at fair prices.</p>
          </div>
          {user ? (
            <button onClick={() => setShowSell(true)} className="shrink-0 inline-flex items-center gap-2 bg-black-forest text-white font-bold px-5 py-2.5 rounded-xl hover:bg-forest transition-colors shadow-sm">+ Post Listing</button>
          ) : (
            <a href="/login" className="shrink-0 inline-flex items-center gap-2 bg-frosted text-black-forest font-bold px-5 py-2.5 rounded-xl hover:bg-tea transition-colors border border-olive/40 text-sm">Login to Post a Listing</a>
          )}
        </header>
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" maxLength={6} placeholder="Filter by pincode..." className="border border-olive/40 bg-white rounded-xl px-4 py-2 text-sm outline-none focus:border-forest w-44" value={pincode} onChange={e => setPincode(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === c ? 'bg-black-forest text-white' : 'bg-white border border-olive/40 text-ash hover:border-palm'}`}>{c}</button>)}
          </div>
        </div>
        {loading && <div className="flex items-center gap-3 text-sm text-ash py-10"><div className="w-5 h-5 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /> Loading listings...</div>}
        {error && !loading && <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700 mb-4">{error}</div>}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-16 text-ash">
            <div className="w-16 h-16 bg-frosted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-olive/30"><span className="font-cinzel font-black text-forest text-xl">0</span></div>
            <p className="font-cinzel font-semibold text-black-forest">No listings found.</p>
            <p className="text-sm mt-1">Be the first to post a listing in your area!</p>
          </div>
        )}
        {!loading && listings.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map(l => (
              <div key={l._id} className="bg-white rounded-2xl border border-olive/30 shadow-sm p-4 hover:shadow-md hover:border-palm transition-all">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div><p className="font-cinzel font-bold text-black-forest text-base">{l.cropName}</p><p className="text-xs text-ash mt-0.5">{l.farmerName} - {l.pincode}</p></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-frosted text-forest px-2 py-1 rounded-full border border-olive/30">{l.category}</span>
                    {user && l.userId === user.id && <button onClick={() => handleDelete(l._id)} className="text-[10px] font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded-full transition-colors">Delete</button>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-frosted rounded-xl px-2 py-2"><p className="text-[10px] text-ash mb-0.5">Amount</p><p className="text-sm font-bold text-black-forest">{l.amountKg} kg</p></div>
                  <div className="bg-tea rounded-xl px-2 py-2"><p className="text-[10px] text-forest mb-0.5">Per kg</p><p className="text-sm font-bold text-black-forest">Rs.{l.pricePerKg}</p></div>
                  <div className="bg-vanilla rounded-xl px-2 py-2"><p className="text-[10px] text-copper mb-0.5">Total</p><p className="text-sm font-bold text-black-forest">Rs.{l.totalPrice}</p></div>
                </div>
                <button onClick={() => { setContactListing(l); setContactStatus(''); setContactForm({ buyerName: '', buyerPhone: '', message: '' }) }} className="w-full text-xs font-semibold text-forest border border-olive/40 rounded-xl py-2 hover:bg-frosted transition-colors">Contact Seller</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {contactListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-olive/30 shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div><p className="font-cinzel font-bold text-black-forest">Contact Seller</p><p className="text-xs text-ash">{contactListing.cropName} - {contactListing.farmerName}</p></div>
              <button onClick={() => setContactListing(null)} className="w-8 h-8 flex items-center justify-center rounded-full border border-olive/40 text-ash text-sm hover:bg-frosted">x</button>
            </div>
            {contactStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-frosted rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-forest font-black text-lg">v</span></div>
                <p className="font-cinzel font-bold text-black-forest">Enquiry Sent!</p>
                <p className="text-sm text-ash mt-1">The seller will reach out to you shortly.</p>
                <button onClick={() => setContactListing(null)} className="mt-4 text-sm font-semibold text-forest underline">Close</button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                {[['Your Name','buyerName'],['Phone Number','buyerPhone']].map(([label,key]) => (
                  <div key={key}><label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-1">{label}</label><input required className={inp} value={contactForm[key]} onChange={e => setContactForm({ ...contactForm, [key]: e.target.value })} /></div>
                ))}
                <div><label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-1">Message (optional)</label><textarea rows="2" className={inp + ' resize-none'} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} /></div>
                {contactStatus === 'error' && <p className="text-xs text-red-500">Could not send enquiry. Try again.</p>}
                <button type="submit" className="w-full bg-black-forest text-white font-bold py-3 rounded-xl hover:bg-forest transition-colors">Send Enquiry</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showSell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-olive/30 shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-cinzel font-bold text-black-forest">Post a Listing</p>
              <button onClick={() => setShowSell(false)} className="w-8 h-8 flex items-center justify-center rounded-full border border-olive/40 text-ash text-sm hover:bg-frosted">x</button>
            </div>
            <form onSubmit={handleSell} className="space-y-4">
              {[['Your Name','farmerName','text','e.g. Ramesh Kumar'],['Crop Name','cropName','text','e.g. Tomato'],['Pincode','pincode','text','6-digit pincode'],['Amount (kg)','amountKg','number','e.g. 100'],['Price per kg (Rs.)','pricePerKg','number','e.g. 25']].map(([label,key,type,ph]) => (
                <div key={key}><label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-1">{label}</label><input required type={type} placeholder={ph} className={inp} value={sellForm[key]} onChange={e => setSellForm({ ...sellForm, [key]: e.target.value })} /></div>
              ))}
              <div><label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-1">Category</label><select className={inp} value={sellForm.category} onChange={e => setSellForm({ ...sellForm, category: e.target.value })}>{CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}</select></div>
              {sellError && <p className="text-xs text-red-500">{sellError}</p>}
              <button type="submit" disabled={sellLoading} className="w-full bg-black-forest text-white font-bold py-3 rounded-xl hover:bg-forest transition-colors disabled:opacity-60">{sellLoading ? 'Posting...' : 'Post Listing'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
