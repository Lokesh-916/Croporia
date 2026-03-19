import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EvervaultCard from '../../components/ui/EvervaultCard';
import Navbar from '../../components/Navbar';

export default function CropWiki() {
  const [allCrops, setAllCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Vegetable', 'Fruit', 'Field Crop', 'Herbs & Spices'];

  const getCatMeta = (cat) => {
    switch (cat.toLowerCase()) {
      case 'vegetable': return { color: '#16a34a', bg: '#dcfce7', emoji: '🥦', label: 'Vegetable' };
      case 'fruit':     return { color: '#ea580c', bg: '#ffedd5', emoji: '🍎', label: 'Fruit' };
      case 'field crop':return { color: '#ca8a04', bg: '#fef9c3', emoji: '🌾', label: 'Field Crop' };
      case 'herbs & spices': return { color: '#7c3aed', bg: '#ede9fe', emoji: '🌿', label: 'Herb' };
      default: return { color: '#4b5563', bg: '#f3f4f6', emoji: '🌱', label: cat };
    }
  };

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const res = await fetch('/crops.json');
        const data = await res.json();
        setAllCrops(data);
        setFilteredCrops(data);
      } catch (error) {
        console.error('Failed to fetch crops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  useEffect(() => {
    let result = allCrops;
    if (activeCategory !== 'All') {
      result = result.filter(c => c.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (search) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCrops(result);
  }, [activeCategory, search, allCrops]);

  const groupedCrops = filteredCrops.reduce((groups, crop) => {
    const cat = crop.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(crop);
    return groups;
  }, {});

  const sortedCategories = ['vegetable', 'fruit', 'field crop', 'herbs & spices'].filter(
    cat => groupedCrops[cat] && groupedCrops[cat].length > 0
  );

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <style>{`
        .glass-nav {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e5e7eb;
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO — compact */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <p className="text-[10px] font-bold text-green-500 mb-2 tracking-widest uppercase">Indian Farming Companion</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Know your <span className="text-green-400">crop.</span>
          </h1>
          <p className="text-gray-400 text-base mb-6 max-w-xl">
            Real costs. Real conditions. No guesswork. 43 Indian crops — all in one place.
          </p>
          {/* Category pill filters */}
          <div className="flex flex-wrap gap-2 mb-4 relative z-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-8 py-8 space-y-14 pb-20">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredCrops.length > 0 ? (
          sortedCategories.map((catName) => {
            const meta = getCatMeta(catName);
            return (
              <section key={catName}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-lg">{meta.emoji}</span>
                  <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">{catName}</h2>
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                    {groupedCrops[catName].length} crops
                  </span>
                </div>

                {/* Grid with EvervaultCard hover-reveal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupedCrops[catName].map((crop) => (
                    <Link key={crop.slug} to={`/crops/${crop.slug}`}>
                      <EvervaultCard
                        accentColor={meta.color}
                        className="h-full"
                        revealContent={
                          <div className="p-5 flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{meta.emoji}</span>
                                <h3 className="font-black text-gray-900 text-sm">{crop.name}</h3>
                              </div>
                              <div className="space-y-2">
                                {[
                                  ['Harvest', `${crop.time?.harvest_days ?? '—'} days`],
                                  ['Soil', crop.conditions?.soil?.split(',')[0] || '—'],
                                  ['Season', crop.conditions?.season || '—'],
                                  ['Water', crop.conditions?.water?.split(',')[0] || '—'],
                                ].map(([label, val]) => (
                                  <div key={label} className="flex justify-between items-start py-1.5 border-b border-gray-50">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                                    <span className="text-[11px] font-semibold text-gray-800 text-right max-w-[130px] leading-tight">{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-center mt-3" style={{ color: meta.color }}>Tap to open →</p>
                          </div>
                        }
                      >
                        {/* Default View */}
                        <div className="flex flex-col h-full">
                          <div className="h-[110px] flex items-center justify-center text-5xl relative" style={{ backgroundColor: `${meta.color}10` }}>
                            {meta.emoji}
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-900 text-sm mb-0.5 leading-tight">{crop.name}</h3>
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: meta.color }}>{crop.category}</p>
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">{crop.summary}</p>
                            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-300 uppercase">Hover for data</span>
                              <span className="text-sm font-black text-gray-900">{crop.time?.harvest_days || '—'}<span className="text-[9px] font-medium text-gray-400 ml-0.5">d</span></span>
                            </div>
                          </div>
                        </div>
                      </EvervaultCard>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-24 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <h3 className="text-xl font-black text-gray-800 mb-2">No results for &quot;{search}&quot;</h3>
            <p className="text-gray-400 text-sm mb-6">Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-green-700 font-bold text-sm underline underline-offset-4">
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-100 text-center bg-gray-900">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Croporia • Crop Wiki • 2026</p>
      </footer>
    </div>
  );
}
