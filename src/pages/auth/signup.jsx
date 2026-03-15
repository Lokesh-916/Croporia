import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundBeams } from '../../components/ui/BackgroundBeams';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('croporia_token', data.token);
        localStorage.setItem('croporia_user', JSON.stringify(data.user));
        navigate('/community');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f0] flex items-center justify-center relative overflow-hidden font-sans selection:bg-green-200 py-10">
      <BackgroundBeams />
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative z-10 mx-4">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-black text-[#1a3d0a] tracking-tight font-serif italic mb-2">Croporia Scanner</h1>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
            <span className="text-lg">⚠</span> {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); if (step === 1) setStep(2); else handleSubmit(e); }} className="space-y-5">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-black text-gray-900 mb-6">Create your profile</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text" required
                    className="w-full bg-white px-5 py-3.5 rounded-xl text-sm font-medium text-gray-900 border border-gray-200 focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all outline-none"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    type="email" required
                    className="w-full bg-white px-5 py-3.5 rounded-xl text-sm font-medium border border-gray-200 focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all outline-none"
                    placeholder="farmer@croporia.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <input
                    type="password" required minLength={6}
                    className="w-full bg-white px-5 py-3.5 rounded-xl text-sm font-medium text-gray-900 border border-gray-200 focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all outline-none"
                    placeholder="Min 6 characters"
                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] mt-8">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-black text-gray-900 mb-6">How do you use Croporia?</h2>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Farmer' })}
                  className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                    formData.role === 'Farmer' ? 'border-[#4caf50] bg-green-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <span className="text-4xl mb-3">🌾</span>
                  <span className={`font-black ${formData.role === 'Farmer' ? 'text-green-800' : 'text-gray-900'}`}>I am a Farmer</span>
                  <span className="text-xs font-medium text-gray-500 mt-1 text-center">Manage fields, track crops, ask the community</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Expert' })}
                  className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                    formData.role === 'Expert' ? 'border-[#c8a000] bg-amber-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <span className="text-4xl mb-3">🔬</span>
                  <span className={`font-black ${formData.role === 'Expert' ? 'text-amber-800' : 'text-gray-900'}`}>I am an Expert</span>
                  <span className="text-xs font-medium text-gray-500 mt-1 text-center">Share knowledge, answer questions, get featured</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#1a3d0a] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(26,61,10,0.5)] active:scale-[0.98] disabled:opacity-70">
                  {loading ? 'Creating Account...' : 'Finish Registration'}
                </button>
              </div>
            </div>
          )}

        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1a3d0a] hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
