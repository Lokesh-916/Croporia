import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7f0] text-gray-900 font-sans">
      <h1 className="text-5xl font-black text-[#1a3d0a] mb-6 tracking-tight">Croporia</h1>
      <p className="mb-10 text-gray-500 font-medium tracking-wide">Agricultural Wiki & Farm Management</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/crops" className="bg-[#1a3d0a] hover:bg-green-900 transition-colors text-white px-6 py-3 rounded-xl font-bold shadow-sm">Explore Crops</Link>
        <Link to="/practices" className="bg-[#c8a000] hover:bg-amber-600 transition-colors text-white px-6 py-3 rounded-xl font-bold shadow-sm">Farming Practices</Link>
        <Link to="/fields" className="bg-[#2D5A27] hover:bg-green-800 transition-colors text-white px-6 py-3 rounded-xl font-bold shadow-sm">My Fields</Link>
        <Link to="/community" className="bg-[#18181b] hover:bg-black transition-colors text-white px-6 py-3 rounded-xl font-bold shadow-sm">Community</Link>
      </div>
    </div>
  );
}
