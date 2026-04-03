import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Microscope, User, Mail, Lock, ArrowRight, ChevronLeft, MapPin, Briefcase, Wheat, Languages } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer', specialization: '', region: '', experience: '', crops: '', languages: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    const payload = { name: formData.name, email: formData.email, password: formData.password, role: formData.role }
    if (formData.role === 'Expert') payload.expertDetails = { specialization: formData.specialization, region: formData.region, experience: formData.experience, crops: formData.crops, languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean) }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (res.ok) { localStorage.setItem('croporia_token', data.token); localStorage.setItem('croporia_user', JSON.stringify(data.user)); navigate('/community') }
      else setError(data.error || 'Registration failed')
    } catch { setError('Cannot connect to server') }
    finally { setLoading(false) }
  }

  const totalSteps = formData.role === 'Expert' ? 3 : 2
  const inp = "w-full bg-frosted/50 pl-11 pr-5 py-3.5 rounded-xl text-sm font-medium text-black-forest border border-olive/40 focus:border-forest focus:ring-4 focus:ring-forest/10 transition-all outline-none"

  return (
    <div className="min-h-screen bg-vanilla flex items-center justify-center relative overflow-hidden font-sans py-10 px-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tea rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olive rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-olive/30 shadow-[0_20px_60px_-15px_rgba(20,54,1,0.12)] relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/organic.png" alt="Croporia" className="w-7 h-7 object-contain" />
            <span className="font-cinzel font-black text-2xl text-black-forest group-hover:text-forest transition-colors">Croporia</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step > i || step === i + 1 ? 'bg-forest w-8' : 'bg-olive/40 w-5'}`} />
            ))}
          </div>
        </div>
        {error && <div className="bg-red-50 text-red-700 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-100">{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); if (step === 1) setStep(2); else if (step === 2 && formData.role === 'Expert') setStep(3); else handleSubmit(e) }} className="space-y-5">
          {step === 1 && (
            <div>
              <h2 className="font-cinzel text-xl font-bold text-black-forest mb-6">Create your profile</h2>
              <div className="space-y-4">
                {[['Full Name','name','text','e.g. Ramesh Kumar',User],['Email Address','email','email','farmer@croporia.com',Mail],['Password','password','password','Min 6 characters',Lock]].map(([label,key,type,ph,Icon]) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-2">{label}</label>
                    <div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-palm" /><input type={type} required placeholder={ph} minLength={key==='password'?6:undefined} className={inp} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} /></div>
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full mt-8 bg-black-forest hover:bg-forest text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">Continue <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-cinzel text-xl font-bold text-black-forest mb-6">How do you use Croporia?</h2>
              <div className="grid grid-cols-1 gap-4 mb-8">
                <button type="button" onClick={() => setFormData({ ...formData, role: 'Farmer' })} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formData.role === 'Farmer' ? 'border-forest bg-frosted shadow-sm' : 'border-olive/30 bg-white hover:border-olive'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.role === 'Farmer' ? 'bg-forest' : 'bg-tea'}`}><Leaf className={`w-6 h-6 ${formData.role === 'Farmer' ? 'text-white' : 'text-forest'}`} /></div>
                  <div><p className="font-bold text-base text-black-forest">I am a Farmer</p><p className="text-xs text-ash/70 mt-0.5">Manage fields, track crops, ask the community</p></div>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, role: 'Expert' })} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formData.role === 'Expert' ? 'border-copper bg-vanilla shadow-sm' : 'border-olive/30 bg-white hover:border-olive'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.role === 'Expert' ? 'bg-copper' : 'bg-cream'}`}><Microscope className={`w-6 h-6 ${formData.role === 'Expert' ? 'text-white' : 'text-copper'}`} /></div>
                  <div><p className="font-bold text-base text-black-forest">I am an Expert</p><p className="text-xs text-ash/70 mt-0.5">Share knowledge, answer questions, get featured</p></div>
                </button>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-5 py-4 rounded-xl font-bold bg-frosted border border-olive/40 text-ash hover:bg-tea transition-all flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-black-forest hover:bg-forest text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                  {formData.role === 'Expert' ? <>Next <ArrowRight className="w-4 h-4" /></> : loading ? 'Creating Account...' : 'Finish Registration'}
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="font-cinzel text-xl font-bold text-black-forest mb-2">Expert Profile</h2>
              <p className="text-xs text-ash mb-6">This info will be shown to farmers looking for guidance.</p>
              <div className="space-y-4">
                {[['Specialization','specialization','text','e.g. Soil & Nutrient Management',Briefcase],['Region','region','text','e.g. Punjab, India',MapPin],['Years of Experience','experience','text','e.g. 10+ years in horticulture',Briefcase],['Crops You Advise On','crops','text','e.g. Wheat, Paddy, Maize',Wheat],['Languages (comma separated)','languages','text','e.g. English, Hindi, Punjabi',Languages]].map(([label,key,type,ph,Icon]) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-2">{label}</label>
                    <div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-palm" /><input type={type} required placeholder={ph} className={inp} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} /></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(2)} className="px-5 py-4 rounded-xl font-bold bg-frosted border border-olive/40 text-ash hover:bg-tea transition-all flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-black-forest hover:bg-forest text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-70">{loading ? 'Creating Account...' : 'Complete Registration'}</button>
              </div>
            </div>
          )}
        </form>
        <p className="mt-8 text-center text-sm font-medium text-ash">Already have an account? <Link to="/login" className="font-bold text-black-forest hover:text-forest transition-colors underline underline-offset-4">Sign in</Link></p>
      </div>
    </div>
  )
}
