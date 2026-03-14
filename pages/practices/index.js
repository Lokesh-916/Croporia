import { useEffect, useRef } from 'react';
import Link from 'next/link';

const PRACTICES = {
  traditional: {
    label: 'Traditional Practices',
    icon: '🌾',
    number: '01',
    accentColor: '#b45309',
    bannerBg: '#78350f',
    cardBorder: '#d97706',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    items: [
      { name: 'Crop Rotation', description: 'Rotating crops each season to restore soil nutrients naturally.', appliesTo: ['Rice', 'Wheat', 'Groundnut'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
      { name: 'Mulching', description: 'Covering soil with organic material to retain moisture.', appliesTo: ['Tomato', 'Chilli', 'Brinjal'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
      { name: 'Intercropping', description: 'Growing two crops together to maximize yield per acre.', appliesTo: ['Groundnut', 'Cotton', 'Maize'], difficulty: 'Medium', cost: 'Low', category: 'traditional' },
      { name: 'Raised Bed Farming', description: 'Elevated planting rows for better drainage and root growth.', appliesTo: ['Onion', 'Garlic', 'Carrot'], difficulty: 'Medium', cost: 'Medium', category: 'traditional' },
      { name: 'Composting', description: 'Converting farm waste into rich organic fertilizer.', appliesTo: ['All crops'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
      { name: 'Flood Irrigation', description: 'Traditional method of flooding fields for water-intensive crops.', appliesTo: ['Rice', 'Sugarcane'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
    ],
  },
  technology: {
    label: 'New Technology',
    icon: '🤖',
    number: '02',
    accentColor: '#1d4ed8',
    bannerBg: '#1e3a8a',
    cardBorder: '#3b82f6',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    items: [
      { name: 'Drip Irrigation', description: 'Delivering water directly to roots, reducing waste by up to 60%.', appliesTo: ['Tomato', 'Chilli', 'Mango'], difficulty: 'Medium', cost: 'High', category: 'technology' },
      { name: 'Drone Spraying', description: 'Using drones to spray pesticides with precision and speed.', appliesTo: ['Rice', 'Cotton', 'Wheat'], difficulty: 'Hard', cost: 'High', category: 'technology' },
      { name: 'Soil Sensors', description: 'Electronic sensors that monitor moisture and nutrient levels.', appliesTo: ['All crops'], difficulty: 'Medium', cost: 'High', category: 'technology' },
      { name: 'Poly House Farming', description: 'Growing crops inside controlled plastic greenhouses.', appliesTo: ['Tomato', 'Capsicum', 'Cucumber'], difficulty: 'Hard', cost: 'High', category: 'technology' },
      { name: 'Fertigation', description: 'Delivering fertilizer through drip irrigation system directly to roots.', appliesTo: ['Banana', 'Mango', 'Tomato'], difficulty: 'Medium', cost: 'Medium', category: 'technology' },
      { name: 'GPS Field Mapping', description: 'Mapping farm boundaries and soil zones using GPS for precision farming.', appliesTo: ['All crops'], difficulty: 'Hard', cost: 'High', category: 'technology' },
    ],
  },
  organic: {
    label: 'Organic & Natural',
    icon: '🌿',
    number: '03',
    accentColor: '#166534',
    bannerBg: '#14532d',
    cardBorder: '#16a34a',
    badgeBg: '#dcfce7',
    badgeText: '#14532d',
    items: [
      { name: 'Vermicomposting', description: 'Using earthworms to convert organic waste into rich manure.', appliesTo: ['All crops'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Neem Pesticide', description: 'Natural neem-based spray that repels pests without chemicals.', appliesTo: ['Tomato', 'Chilli', 'Brinjal'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Green Manuring', description: 'Growing and ploughing in legume crops to enrich soil nitrogen.', appliesTo: ['Rice', 'Wheat', 'Cotton'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
      { name: 'Companion Planting', description: "Planting crops together that naturally repel each other's pests.", appliesTo: ['Tomato', 'Maize', 'Onion'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
      { name: 'Biofertilizers', description: 'Microorganism-based fertilizers that fix nitrogen from the air.', appliesTo: ['Groundnut', 'Soybean', 'Rice'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Natural Pest Traps', description: 'Yellow sticky traps and pheromone traps to catch insects.', appliesTo: ['Tomato', 'Cotton', 'Chilli'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
    ],
  },
};

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function difficultyStyle(d) {
  if (d === 'Easy') return { bg: '#dcfce7', text: '#166534' };
  if (d === 'Medium') return { bg: '#fef9c3', text: '#854d0e' };
  return { bg: '#fee2e2', text: '#991b1b' };
}

function costSymbol(c) {
  if (c === 'Low') return '₹ Low';
  if (c === 'Medium') return '₹₹ Med';
  return '₹₹₹ High';
}

function PracticeCard({ practice, cat }) {
  const diff = difficultyStyle(practice.difficulty);
  return (
    <Link href={`/practices/${toSlug(practice.name)}`}>
      <div
        className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col h-full"
        style={{ border: `1.5px solid ${cat.cardBorder}30` }}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: cat.accentColor }} />
        <div className="p-4 flex flex-col flex-1 gap-2">
          <p className="font-bold text-[14px] text-gray-900">{practice.name}</p>
          <p className="text-[12px] text-gray-500 leading-snug">{practice.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {practice.appliesTo.map((crop) => (
              <span key={crop} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.badgeBg, color: cat.badgeText }}>{crop}</span>
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: diff.bg, color: diff.text }}>{practice.difficulty}</span>
            <span className="text-[11px] font-medium text-gray-400">{costSymbol(practice.cost)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PracticesIndex() {
  const bannerRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      }),
      { threshold: 0.1 }
    );
    bannerRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <style jsx global>{`
        .glass-nav {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e5e7eb;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-8 glass-nav">
        <Link href="/crops" className="text-gray-900 font-black text-xl tracking-tight">Croporia</Link>
        <div className="flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <Link href="/crops" className="hover:text-green-700 transition-colors">Wiki</Link>
          <Link href="/practices" className="text-green-700 border-b-2 border-green-700 pb-0.5">Practices</Link>
          <a href="#" className="hover:text-green-700 transition-colors">My Farm</a>
          <a href="#" className="hover:text-green-700 transition-colors">Community</a>
        </div>
      </nav>

      {/* HERO — compact dark header */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-green-400 mb-2 tracking-widest uppercase">Croporia / Practices</p>
            <h1 className="text-4xl font-black text-white leading-tight mb-2">Farming Practices</h1>
            <p className="text-[15px] text-gray-400 max-w-[380px] leading-relaxed">
              Traditional wisdom. Modern technology. Natural methods.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            {Object.values(PRACTICES).map((cat) => (
              <a
                key={cat.label}
                href={`#${cat.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl transition-all hover:bg-white/10 cursor-pointer bg-white/5 border border-white/10"
              >
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <span className="text-[10px] font-bold text-white/60 whitespace-nowrap">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-14 pb-20">
        {Object.entries(PRACTICES).map(([key, cat], idx) => (
          <section key={key} id={cat.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}>
            {/* BANNER */}
            <div
              ref={(el) => (bannerRefs.current[idx] = el)}
              className="w-full h-[120px] flex items-center px-8 relative overflow-hidden mb-5 rounded-xl"
              style={{
                backgroundColor: cat.bannerBg,
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {/* Huge faded number */}
              <div
                className="absolute right-6 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none"
                style={{ fontSize: '100px', color: 'white', opacity: 0.06 }}
              >
                {cat.number}
              </div>
              <div className="z-10">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-xl font-black text-white">{cat.label}</h2>
                </div>
                <p className="text-[13px] text-white/70 max-w-md">{
                  key === 'traditional' ? 'Time-tested methods passed down through generations of Indian farmers.' :
                  key === 'technology' ? 'Modern tools, sensors, and techniques bringing precision to the farm.' :
                  'No chemicals. Nature-based solutions that protect soil and health.'
                }</p>
              </div>
            </div>

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((practice) => (
                <PracticeCard key={practice.name} practice={practice} cat={cat} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-100 text-center bg-gray-900">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Croporia • Farming Practices Wiki • 2026</p>
      </footer>
    </div>
  );
}
