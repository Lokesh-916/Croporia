import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EvervaultCard from '../../components/ui/EvervaultCard'
import Navbar from '../../components/Navbar'

const CROP_IMAGES = {
  'tomato':'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
  'brinjal':'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80',
  'okra':'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&q=80',
  'chilli':'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80',
  'onion':'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&q=80',
  'potato':'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  'cauliflower':'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80',
  'cabbage':'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&q=80',
  'spinach':'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'carrot':'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  'mango':'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
  'banana':'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
  'papaya':'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&q=80',
  'guava':'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80',
  'watermelon':'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
  'pomegranate':'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
  'coconut':'https://images.unsplash.com/photo-1580984969071-a8da8e0f6f84?w=400&q=80',
  'jackfruit':'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80',
  'rice':'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80',
  'wheat':'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  'maize':'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&q=80',
  'groundnut':'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&q=80',
  'sunflower':'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80',
  'cotton':'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80',
  'sugarcane':'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'turmeric':'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
  'ginger':'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
  'garlic':'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80',
  'mint':'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80',
  'aloe-vera':'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&q=80',
}

export default function CropWiki() {
  const [allCrops, setAllCrops] = useState([])
  const [filteredCrops, setFilteredCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Vegetable', 'Fruit', 'Field Crop', 'Herbs & Spices']

  const getCatMeta = (cat) => {
    switch (cat.toLowerCase()) {
      case 'vegetable': return { color: '#538d22', bg: '#e9f5db', icon: 'Veg' }
      case 'fruit': return { color: '#a98467', bg: '#f0ead2', icon: 'Frt' }
      case 'field crop': return { color: '#718355', bg: '#cfe1b9', icon: 'Fld' }
      case 'herbs & spices': return { color: '#245501', bg: '#dde5b6', icon: 'Hrb' }
      default: return { color: '#6c584c', bg: '#f0ead2', icon: '—' }
    }
  }

  useEffect(() => {
    fetch('/crops.json').then(r => r.json()).then(data => { setAllCrops(data); setFilteredCrops(data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = allCrops
    if (activeCategory !== 'All') result = result.filter(c => c.category.toLowerCase() === activeCategory.toLowerCase())
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
    setFilteredCrops(result)
  }, [activeCategory, search, allCrops])

  const grouped = filteredCrops.reduce((g, crop) => { const cat = crop.category; if (!g[cat]) g[cat] = []; g[cat].push(crop); return g }, {})
  const sortedCats = ['vegetable', 'fruit', 'field crop', 'herbs & spices'].filter(cat => grouped[cat]?.length > 0)

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <section className="bg-black-forest border-b border-forest/30">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <p className="text-[10px] font-bold text-willow mb-2 tracking-widest uppercase">Indian Farming Companion</p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-white tracking-tight mb-3">Know your <span className="text-willow">crop.</span></h1>
          <p className="text-tea text-base mb-6 max-w-xl">Real costs. Real conditions. No guesswork. 43 Indian crops all in one place.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${activeCategory === cat ? 'bg-willow text-black-forest' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{cat}</button>)}
          </div>
          <input type="text" placeholder="Search crops..." value={search} onChange={e => setSearch(e.target.value)} className="mt-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-willow/60 w-full max-w-xs" />
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-8 py-8 space-y-14 pb-20">
        {loading ? (
          <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /></div>
        ) : filteredCrops.length > 0 ? sortedCats.map(catName => {
          const meta = getCatMeta(catName)
          return (
            <section key={catName}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black text-white" style={{ backgroundColor: meta.color }}>{meta.icon}</div>
                <h2 className="font-cinzel text-[13px] font-black text-black-forest uppercase tracking-widest">{catName}</h2>
                <div className="flex-1 h-px bg-olive/30" />
                <span className="text-[10px] font-bold text-ash bg-frosted px-2.5 py-1 rounded-full border border-olive/30">{grouped[catName].length} crops</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grouped[catName].map(crop => (
                  <Link key={crop.slug} to={`/crops/${crop.slug}`}>
                    <EvervaultCard accentColor={meta.color} className="h-full"
                      revealContent={
                        <div className="p-5 flex flex-col h-full justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: meta.color }}>{meta.icon}</div>
                              <h3 className="font-cinzel font-black text-black-forest text-sm">{crop.name}</h3>
                            </div>
                            <div className="space-y-2">
                              {[['Harvest',`${crop.time?.harvest_days ?? '—'} days`],['Soil',crop.conditions?.soil?.split(',')[0]||'—'],['Season',crop.conditions?.season||'—'],['Water',crop.conditions?.water?.split(',')[0]||'—']].map(([label,val]) => (
                                <div key={label} className="flex justify-between items-start py-1.5 border-b border-olive/20">
                                  <span className="text-[10px] font-bold text-ash uppercase tracking-wider">{label}</span>
                                  <span className="text-[11px] font-semibold text-black-forest text-right max-w-[130px] leading-tight">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-center mt-3" style={{ color: meta.color }}>Tap to open</p>
                        </div>
                      }>
                      <div className="flex flex-col h-full">
                        <div className="h-[110px] overflow-hidden relative" style={{ backgroundColor: `${meta.color}15` }}>
                          {CROP_IMAGES[crop.slug] ? (
                            <img src={CROP_IMAGES[crop.slug]} alt={crop.name} className="w-full h-full object-cover" loading="lazy" onError={e => { e.target.style.display='none' }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ backgroundColor: meta.color }}>{meta.icon}</div></div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-cinzel font-bold text-black-forest text-sm mb-0.5 leading-tight">{crop.name}</h3>
                          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: meta.color }}>{crop.category}</p>
                          <p className="text-ash text-xs leading-relaxed line-clamp-3 flex-1">{crop.summary}</p>
                          <div className="mt-3 pt-3 border-t border-olive/20 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-ash/50 uppercase">Hover for data</span>
                            <span className="text-sm font-black text-black-forest">{crop.time?.harvest_days||'—'}<span className="text-[9px] font-medium text-ash ml-0.5">d</span></span>
                          </div>
                        </div>
                      </div>
                    </EvervaultCard>
                  </Link>
                ))}
              </div>
            </section>
          )
        }) : (
          <div className="text-center py-24 rounded-2xl bg-frosted border border-dashed border-olive/40">
            <h3 className="font-cinzel text-xl font-black text-black-forest mb-2">No results for "{search}"</h3>
            <p className="text-ash text-sm mb-6">Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-forest font-bold text-sm underline underline-offset-4">Reset Filters</button>
          </div>
        )}
      </main>
      <footer className="py-8 border-t border-olive/20 text-center bg-black-forest">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Croporia - Crop Wiki - 2026</p>
      </footer>
    </div>
  )
}
