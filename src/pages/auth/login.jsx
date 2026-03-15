import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundBeams } from '../../components/ui/BackgroundBeams';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
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
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f0] flex items-center justify-center relative overflow-hidden font-sans selection:bg-green-200">
      <BackgroundBeams />
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative z-10 mx-4">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-black text-[#1a3d0a] tracking-tight font-serif italic mb-2">Croporia</h1>
          </Link>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
            <span className="text-lg">⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-white px-5 py-4 rounded-xl text-sm font-medium text-gray-900 border border-gray-200 focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all outline-none"
              placeholder="farmer@croporia.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2 pr-1">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <a href="#" className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors">Forgot?</a>
            </div>
            <input
              type="password"
              required
              className="w-full bg-white px-5 py-4 rounded-xl text-sm font-medium text-gray-900 border border-gray-200 focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3d0a] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(26,61,10,0.5)] active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          New to Croporia?{' '}
          <Link to="/signup" className="font-bold text-[#1a3d0a] hover:underline underline-offset-4">Register your farm</Link>
        </p>
      </div>
    </div>
  );
}
