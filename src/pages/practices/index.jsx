import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const PRACTICES = {
  traditional: {
    label: 'Traditional Practices', number: '01',
    accentColor: '#718355', bannerBg: '#245501', cardBorder: '#97a97c', badgeBg: '#e9f5db', badgeText: '#245501',
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
    label: 'New Technology', number: '02',
    accentColor: '#538d22', bannerBg: '#143601', cardBorder: '#73a942', badgeBg: '#e9f5db', badgeText: '#143601',
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
    label: 'Organic & Natural', number: '03',
    accentColor: '#245501', bannerBg: '#1a4301', cardBorder: '#73a942', badgeBg: '#cfe1b9', badgeText: '#143601',
    items: [
      { name: 'Vermicomposting', description: 'Using earthworms to convert organic waste into rich manure.', appliesTo: ['All crops'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Neem Pesticide', description: 'Natural neem-based spray that repels pests without chemicals.', appliesTo: ['Tomato', 'Chilli', 'Brinjal'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Green Manuring', description: 'Growing and ploughing in legume crops to enrich soil nitrogen.', appliesTo: ['Rice', 'Wheat', 'Cotton'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
      { name: 'Companion Planting', description: 'Planting crops together that naturally repel each other pests.', appliesTo: ['Tomato', 'Maize', 'Onion'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
      { name: 'Biofertilizers', description: 'Microorganism-based fertilizers that fix nitrogen from the air.', appliesTo: ['Groundnut', 'Soybean', 'Rice'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
      { name: 'Natural Pest Traps', description: 'Yellow sticky traps and pheromone traps to catch insects.', appliesTo: ['Tomato', 'Cotton', 'Chilli'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
    ],
  },
}

function toSlug(name) { return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
function diffStyle(d) { if (d === 'Easy') return { bg: '#e9f5db', text: '#245501' }; if (d === 'Medium') return { bg: '#f0ead2', text: '#a98467' }; return { bg: '#fee2e2', text: '#991b1b' } }
function costSymbol(c) { if (c === 'Low') return 'Rs Low'; if (c === 'Medium') return 'Rs Rs Med'; return 'Rs Rs Rs High' }

function PracticeCard({ practice, cat }) {
  const diff = diffStyle(practice.difficulty)
  return (
    <Link to={`/practices/${toSlug(practice.name)}`}>
      <div className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col h-full" style={{ border: `1.5px solid ${cat.cardBorder}30` }}>
        <div className="h-1.5 w-full" style={{ backgroundColor: cat.accentColor }} />
        <div className="p-4 flex flex-col flex-1 gap-2">
          <p className="font-cinzel font-bold text-[14px] text-black-forest">{practice.name}</p>
          <p className="text-[12px] text-ash leading-snug">{practice.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {practice.appliesTo.map(crop => <span key={crop} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.badgeBg, color: cat.badgeText }}>{crop}</span>)}
          </div>
          <div className="mt-auto pt-3 border-t border-olive/20 flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: diff.bg, color: diff.text }}>{practice.difficulty}</span>
            <span className="text-[11px] font-medium text-ash">{costSymbol(practice.cost)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PracticesIndex() {
  const bannerRefs = useRef([])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' } }), { threshold: 0.1 })
    bannerRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <section className="bg-black-forest border-b border-forest/30">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-willow mb-2 tracking-widest uppercase">Croporia / Practices</p>
            <h1 className="font-cinzel text-4xl font-black text-white leading-tight mb-2">Farming Practices</h1>
            <p className="text-[15px] text-tea max-w-[380px] leading-relaxed">Traditional wisdom. Modern technology. Natural methods.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {Object.values(PRACTICES).map(cat => (
              <button key={cat.label} onClick={() => scrollToSection(cat.label.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''))} className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl transition-all hover:bg-white/10 cursor-pointer bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black bg-white/20 text-white">{cat.number}</div>
                <span className="text-[10px] font-bold text-white/60 whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-14 pb-20">
        {Object.entries(PRACTICES).map(([key, cat], idx) => (
          <section key={key} id={cat.label.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}>
            <div ref={el => bannerRefs.current[idx] = el} className="w-full h-[120px] flex items-center px-8 relative overflow-hidden mb-5 rounded-xl" style={{ backgroundColor: cat.bannerBg, opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none" style={{ fontSize: '100px', color: 'white', opacity: 0.06 }}>{cat.number}</div>
              <div className="z-10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black bg-white/20 text-white">{cat.number}</div>
                  <h2 className="font-cinzel text-xl font-black text-white">{cat.label}</h2>
                </div>
                <p className="text-[13px] text-white/70 max-w-md">{key === 'traditional' ? 'Time-tested methods passed down through generations of Indian farmers.' : key === 'technology' ? 'Modern tools, sensors, and techniques bringing precision to the farm.' : 'No chemicals. Nature-based solutions that protect soil and health.'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map(practice => <PracticeCard key={practice.name} practice={practice} cat={cat} />)}
            </div>
          </section>
        ))}
      </main>
      <footer className="py-8 border-t border-olive/20 text-center bg-black-forest">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Croporia - Farming Practices Wiki - 2026</p>
      </footer>
    </div>
  )
}
