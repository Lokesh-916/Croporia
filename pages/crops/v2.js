import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function CropWikiV2() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  
  const data = {
    vegetables: [
      { slug: 'tomato', name: 'Tomato', emoji: '🍅', soil: 'Loamy', season: 'Kharif/Rabi', days: 75 },
      { slug: 'chilli', name: 'Chilli', emoji: '🌶', soil: 'Well-drained', season: 'Kharif', days: 90 },
      { slug: 'onion', name: 'Onion', emoji: '🧅', soil: 'Sandy loam', season: 'Rabi', days: 120 },
      { slug: 'brinjal', name: 'Brinjal', emoji: '🍆', soil: 'Loamy', season: 'Kharif/Rabi', days: 80 }
    ],
    fruits: [
      { slug: 'mango', name: 'Mango', emoji: '🥭', soil: 'Deep soil', season: 'Summer', days: 180 },
      { slug: 'banana', name: 'Banana', emoji: '🍌', soil: 'Moist soil', season: 'Year round', days: 300 },
      { slug: 'guava', name: 'Guava', emoji: '🍈', soil: 'Any soil', season: 'Kharif', days: 150 },
      { slug: 'papaya', name: 'Papaya', emoji: '🍍', soil: 'Loamy', season: 'Year round', days: 270 }
    ],
    fieldCrops: [
      { slug: 'rice', name: 'Rice', emoji: '🌾', soil: 'Clayey', season: 'Kharif', days: 120 },
      { slug: 'sunflower', name: 'Sunflower', emoji: '🌻', soil: 'Loamy', season: 'Rabi/Kharif', days: 90 },
      { slug: 'cotton', name: 'Cotton', emoji: '🪴', soil: 'Black soil', season: 'Kharif', days: 180 },
      { slug: 'groundnut', name: 'Groundnut', emoji: '🫘', soil: 'Sandy loam', season: 'Kharif', days: 110 }
    ],
    herbs: [
      { slug: 'turmeric', name: 'Turmeric', emoji: '🟡', soil: 'Loamy', season: 'Kharif', days: 270 },
      { slug: 'garlic', name: 'Garlic', emoji: '🧄', soil: 'Sandy loam', season: 'Rabi', days: 150 },
      { slug: 'ginger', name: 'Ginger', emoji: '🫚', soil: 'Well-drained', season: 'Kharif', days: 240 },
      { slug: 'coriander', name: 'Coriander', emoji: '🌱', soil: 'Loamy', season: 'Rabi', days: 45 }
    ]
  };

  const categories = [
    { id: 'vegetables', name: 'Vegetables', desc: 'Fresh greens and essential cooking staples.', count: '01', color: '#4caf50', bg: '#0a2205', emojis: ['🍅', '🍆', '🥦'] },
    { id: 'fruits', name: 'Fruits', desc: 'Sweet, tropical, and nutrient-rich harvests.', count: '02', color: '#ff8c00', bg: '#1f0a00', emojis: ['🥭', '🍌', '🍍'] },
    { id: 'fieldCrops', name: 'Field Crops', desc: 'Large scale grains and industrial gold.', count: '03', color: '#d4a017', bg: '#1a1300', emojis: ['🌾', '🌻', '🪵'] },
    { id: 'herbs', name: 'Herbs & Spices', desc: 'The aromatic heart of Indian fields.', count: '04', color: '#9b59b6', bg: '#0d0a1f', emojis: ['🧄', '🫚', '🌱'] }
  ];

  const floatingEmojis = ['🍅', '🌶', '🧅', '🍆', '🥭', '🍌', '🌾', '🌻', '🧄', '🫚'];

  // Intersection Observer for banners
  const bannerRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.2 }
    );

    bannerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filterCrops = (list) => {
    return list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen font-sans selection:bg-[#c8882a] selection:text-white">
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes custom-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: custom-float 4s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(200, 136, 42, 0.18);
        }
        .glass-banner {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-[56px] flex items-center justify-between px-8 glass-nav transition-all">
        <div className="flex items-center gap-12 flex-1">
          <span className="text-[#2a1f14] font-black text-2xl tracking-tighter font-serif italic">Croporia</span>
          <div className="relative w-full max-w-sm hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search any crop..."
              className="w-full bg-[#fdf8f2]/50 border border-[#c8882a]/20 rounded-full pl-10 pr-5 py-1.5 text-xs focus:ring-2 focus:ring-[#c8882a] focus:bg-white transition-all outline-none text-[#2a1f14]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-10 text-[10px] font-bold text-[#6b4e35] uppercase tracking-[0.2em]">
          <Link href="/crops/v2" className="text-[#c8882a] border-b border-[#c8882a] pb-0.5">Wiki</Link>
          <a href="#" className="hover:text-[#c8882a] transition-colors">My Farm</a>
          <a href="#" className="hover:text-[#c8882a] transition-colors">Community</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="h-screen w-full bg-gradient-to-b from-[#0d2b06] via-[#1a4a0a] to-[#0d2b06] flex flex-col items-center justify-center text-center relative overflow-hidden px-4">
        {/* Floating Emojis Background with different speeds */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingEmojis.map((emoji, idx) => (
            <div
              key={idx}
              className="absolute text-5xl animate-float"
              style={{
                left: `${(idx * 10) + 5}%`,
                bottom: '12%',
                animationDelay: `${idx * 0.6}s`,
                animationDuration: `${3 + (idx % 2)}s`,
                opacity: 0.4
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-5xl animate-fade-up">
          <span className="text-[#c8882a] font-bold text-[10px] tracking-[0.4em] mb-4 block uppercase opacity-80">Empowering Indian Farmers</span>
          <h1 className="text-white text-6xl md:text-[84px] font-black leading-[0.95] mb-8 tracking-tighter">
            Everything you need,<br/><em className="text-[#c8882a] font-serif font-light not-italic">all in one place.</em>
          </h1>
          <p className="text-[#fdf8f2]/70 text-lg md:text-xl font-light mb-12 max-w-xl mx-auto leading-relaxed">
            Real costs. Real conditions. No guesswork. Your fields simplified into a single, seamless wiki experience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className="px-10 py-3.5 rounded-full border border-white/10 bg-white/5 text-white text-[11px] uppercase tracking-widest font-bold hover:bg-[#c8882a] hover:border-[#c8882a] transition-all duration-300 backdrop-blur-md"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      <main className="py-24 space-y-40">
        {categories.map((cat, idx) => {
          const filtered = filterCrops(data[cat.id]);
          if (filtered.length === 0 && search) return null;

          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24 px-8 md:px-16 overflow-hidden">
              {/* OneCampus Style Section Divider */}
              <div className="flex items-center gap-6 mb-12 opacity-40">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#c8882a]"></div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#6b4e35] uppercase">{cat.name} HIGHLIGHTS</span>
                <div className="h-[1px] w-20 bg-[#c8882a]"></div>
              </div>

              {/* Banner - More Cinematic */}
              <div 
                ref={el => bannerRefs.current[idx] = el}
                className="w-full h-[240px] flex items-center px-10 md:px-20 relative rounded-3xl overflow-hidden opacity-0 translate-y-10 transition-all duration-1000 ease-out shadow-2xl"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Large Number Overlay */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 font-black opacity-[0.12] select-none pointer-events-none leading-none" style={{ fontSize: '180px', color: cat.color }}>
                  {cat.count}
                </div>
                
                <div className="flex-1 z-10">
                  <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-bold text-white uppercase tracking-widest mb-4">Category {cat.count}</span>
                  <h2 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tighter">{cat.name}</h2>
                  <p className="text-[#fdf8f2]/60 font-light text-sm max-w-md leading-relaxed">{cat.desc}</p>
                </div>

                <div className="flex gap-6 opacity-30 z-10 hidden lg:flex items-center">
                   <div className="w-px h-24 bg-white/20"></div>
                  {cat.emojis.map((e, i) => (
                    <span key={i} className="text-6xl filter grayscale hover:grayscale-0 transition-all duration-500 cursor-default">{e}</span>
                  ))}
                </div>
              </div>

              {/* Card List - Horizontal Scroll with better spacing */}
              <div className="mt-16 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-8 pb-10 px-2">
                  {filtered.map((crop) => (
                    <div
                      key={crop.slug}
                      onClick={() => router.push(`/crops/${crop.slug}`)}
                      className="flex-shrink-0 w-[220px] bg-white rounded-[24px] border border-[#c8882a]/10 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(42,31,20,0.12)] cursor-pointer group relative"
                    >
                      {/* Card Top */}
                      <div className="h-[140px] flex items-center justify-center text-6xl transition-all group-hover:scale-110 duration-700 bg-[#fdf8f2]/50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" style={{ backgroundColor: cat.color }}></div>
                        <span className="relative z-10">{crop.emoji}</span>
                      </div>
                      
                      {/* Card Bottom */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="font-bold text-[#2a1f14] group-hover:text-[#c8882a] transition-colors tracking-tight text-lg">{crop.name}</h3>
                           <span className="text-xs opacity-20">→</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-[#a87d56] uppercase tracking-wider">{crop.soil} soil • {crop.season}</p>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-[#6b4e35] opacity-50">Harvest time</span>
                            <span className="text-sm font-black text-[#2a1f14]">{crop.days} <span className="text-[9px] font-medium text-[#6b4e35]">DAYS</span></span>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#fdf8f2] group-hover:bg-[#c8882a] transition-all group-hover:rotate-[360deg] duration-700">
                             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* FOOTER */}
      <footer className="py-24 border-t border-[#c8882a]/10 text-center bg-[#2a1f14]">
        <div className="logo text-white font-serif italic text-2xl mb-4">Croporia</div>
        <p className="text-[#fdf8f2]/30 text-[9px] font-bold uppercase tracking-[0.4em]">Unified Farming Portal • &copy; 2026 • Grown with Care</p>
      </footer>
    </div>
  );
}

// Simple Helper Link
function Link({ href, children, className }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
