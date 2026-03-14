import Link from 'next/link';
import { useRouter } from 'next/router';
import TracingBeam from '../../components/ui/TracingBeam';

// ─── Shared Data ────────────────────────────────────────────────────────────
const ALL_PRACTICES = [
  { name: 'Crop Rotation', description: 'Rotating crops each season to restore soil nutrients naturally.', appliesTo: ['Rice', 'Wheat', 'Groundnut'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
  { name: 'Mulching', description: 'Covering soil with organic material to retain moisture.', appliesTo: ['Tomato', 'Chilli', 'Brinjal'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
  { name: 'Intercropping', description: 'Growing two crops together to maximize yield per acre.', appliesTo: ['Groundnut', 'Cotton', 'Maize'], difficulty: 'Medium', cost: 'Low', category: 'traditional' },
  { name: 'Raised Bed Farming', description: 'Elevated planting rows for better drainage and root growth.', appliesTo: ['Onion', 'Garlic', 'Carrot'], difficulty: 'Medium', cost: 'Medium', category: 'traditional' },
  { name: 'Composting', description: 'Converting farm waste into rich organic fertilizer.', appliesTo: ['All crops'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
  { name: 'Flood Irrigation', description: 'Traditional method of flooding fields for water-intensive crops.', appliesTo: ['Rice', 'Sugarcane'], difficulty: 'Easy', cost: 'Low', category: 'traditional' },
  { name: 'Drip Irrigation', description: 'Delivering water directly to roots, reducing waste by up to 60%.', appliesTo: ['Tomato', 'Chilli', 'Mango'], difficulty: 'Medium', cost: 'High', category: 'technology' },
  { name: 'Drone Spraying', description: 'Using drones to spray pesticides with precision and speed.', appliesTo: ['Rice', 'Cotton', 'Wheat'], difficulty: 'Hard', cost: 'High', category: 'technology' },
  { name: 'Soil Sensors', description: 'Electronic sensors that monitor moisture and nutrient levels.', appliesTo: ['All crops'], difficulty: 'Medium', cost: 'High', category: 'technology' },
  { name: 'Poly House Farming', description: 'Growing crops inside controlled plastic greenhouses.', appliesTo: ['Tomato', 'Capsicum', 'Cucumber'], difficulty: 'Hard', cost: 'High', category: 'technology' },
  { name: 'Fertigation', description: 'Delivering fertilizer through drip irrigation system directly to roots.', appliesTo: ['Banana', 'Mango', 'Tomato'], difficulty: 'Medium', cost: 'Medium', category: 'technology' },
  { name: 'GPS Field Mapping', description: 'Mapping farm boundaries and soil zones using GPS for precision farming.', appliesTo: ['All crops'], difficulty: 'Hard', cost: 'High', category: 'technology' },
  { name: 'Vermicomposting', description: 'Using earthworms to convert organic waste into rich manure.', appliesTo: ['All crops'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
  { name: 'Neem Pesticide', description: 'Natural neem-based spray that repels pests without chemicals.', appliesTo: ['Tomato', 'Chilli', 'Brinjal'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
  { name: 'Green Manuring', description: 'Growing and ploughing in legume crops to enrich soil nitrogen.', appliesTo: ['Rice', 'Wheat', 'Cotton'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
  { name: 'Companion Planting', description: "Planting crops together that naturally repel each other's pests.", appliesTo: ['Tomato', 'Maize', 'Onion'], difficulty: 'Medium', cost: 'Low', category: 'organic' },
  { name: 'Biofertilizers', description: 'Microorganism-based fertilizers that fix nitrogen from the air.', appliesTo: ['Groundnut', 'Soybean', 'Rice'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
  { name: 'Natural Pest Traps', description: 'Yellow sticky traps and pheromone traps to catch insects.', appliesTo: ['Tomato', 'Cotton', 'Chilli'], difficulty: 'Easy', cost: 'Low', category: 'organic' },
];

// ─── Full Detail (only Crop Rotation for now) ───────────────────────────────
const PRACTICE_DETAILS = {
  'crop-rotation': {
    what: `Crop rotation is the practice of growing different types of crops in the same area across different growing seasons. This ancient technique breaks pest and disease cycles, replenishes soil nutrients, and reduces the need for synthetic fertilizers. The principle is simple: each crop family uses and adds different nutrients, so alternating them keeps the soil in balance naturally.`,
    why: [
      'Breaks the life cycle of soil-borne pests and diseases that target specific crops.',
      'Legumes (like groundnut) fix atmospheric nitrogen, reducing fertilizer cost for the next crop.',
      'Prevents soil erosion and compaction by varying root structures each season.',
      'Improves long-term soil health, leading to higher yields over multiple years.',
    ],
    steps: [
      'Divide your farm into at least 2–3 sections (or more for larger farms).',
      'Plan the rotation sequence: e.g., Rice → Groundnut → Wheat → Fallow.',
      'After harvest, leave crop residue in the field to decompose before the next planting.',
      'Introduce a legume (groundnut, cowpea, green gram) at least once in the 3-year cycle.',
      'Do not plant the same crop family in the same plot two seasons in a row.',
      'Keep a written record of each plot\'s crop history for at least 3 years.',
    ],
    costs: [
      { item: 'Planning & marking', amount: '₹0 (time only)' },
      { item: 'Seeds for rotation crop', amount: '₹300 – ₹800/acre' },
      { item: 'Additional labour (if new crop)', amount: '₹500 – ₹1,500/acre' },
      { item: 'Record-keeping materials', amount: '₹50 – ₹100' },
    ],
    related: ['Mulching', 'Composting', 'Intercropping'],
  },
};

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const CATEGORY_COLORS = {
  traditional: { color: '#c8a000', bg: '#fdf6e8', label: 'Traditional' },
  technology: { color: '#2060d0', bg: '#e8f0ff', label: 'New Technology' },
  organic: { color: '#2d8a20', bg: '#eaf5e8', label: 'Organic & Natural' },
};

function difficultyStyle(d) {
  if (d === 'Easy') return { bg: '#dcfce7', text: '#166534' };
  if (d === 'Medium') return { bg: '#fef9c3', text: '#854d0e' };
  return { bg: '#fee2e2', text: '#991b1b' };
}

function costSymbol(c) {
  if (c === 'Low') return '₹ Low';
  if (c === 'Medium') return '₹₹ Medium';
  return '₹₹₹ High';
}

export default function PracticeDetail() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return null;

  const practice = ALL_PRACTICES.find((p) => toSlug(p.name) === slug);
  if (!practice) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#1a3d0a] mb-4">Practice not found</h1>
          <Link href="/practices" className="text-[#c8882a] font-bold underline">← Back to Practices</Link>
        </div>
      </div>
    );
  }

  const detail = PRACTICE_DETAILS[slug];
  const catMeta = CATEGORY_COLORS[practice.category] || CATEGORY_COLORS.traditional;
  const diff = difficultyStyle(practice.difficulty);
  const relatedPractices = detail
    ? ALL_PRACTICES.filter((p) => detail.related.includes(p.name))
    : ALL_PRACTICES.filter((p) => p.category === practice.category && p.name !== practice.name).slice(0, 3);

  return (
    <div className="bg-[#fafaf7] min-h-screen font-sans">
      <style jsx global>{`
        .glass-nav {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(200,136,42,0.15);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-[56px] flex items-center justify-between px-8 glass-nav">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/crops" className="text-[#2a1f14] font-black text-2xl tracking-tighter font-serif italic">Croporia</Link>
        </div>
        <div className="flex items-center gap-10 text-[10px] font-bold text-[#6b4e35] uppercase tracking-[0.2em]">
          <Link href="/crops" className="hover:text-[#c8882a] transition-colors">Wiki</Link>
          <Link href="/practices" className="text-[#1a3d0a] border-b border-[#1a3d0a] pb-0.5">Practices</Link>
          <a href="#" className="hover:text-[#c8882a] transition-colors">My Farm</a>
          <a href="#" className="hover:text-[#c8882a] transition-colors">Community</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Back button */}
        <Link href="/practices" className="inline-flex items-center gap-2 text-[12px] font-bold text-[#6b7280] hover:text-[#1a3d0a] transition-colors mb-8 uppercase tracking-wider">
          <span>←</span> Back to Practices
        </Link>

        {/* HERO */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"
              style={{ backgroundColor: catMeta.bg, color: catMeta.color }}
            >
              {catMeta.label}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: diff.bg, color: diff.text }}>{practice.difficulty}</span>
            <span className="text-[10px] font-bold text-[#9ca3af]">{costSymbol(practice.cost)}</span>
          </div>

          <h1 className="text-5xl font-black text-[#1a3d0a] tracking-tight mb-4">{practice.name}</h1>
          <p className="text-[17px] text-[#4b5563] max-w-2xl leading-relaxed">{practice.description}</p>
        </div>

        {/* TracingBeam wraps the long-form detail content — only shown when full detail exists */}
        {detail ? (
          <TracingBeam accentColor={catMeta.color}>
            {/* What it is */}
            <section className="mb-10">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">What it is</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-[15px] text-[#4b5563] leading-relaxed">
                {detail.what}
              </div>
            </section>

            {/* Why it helps */}
            <section className="mb-10">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">Why it helps</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                {detail.why.map((point, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ backgroundColor: catMeta.color }}>✓</span>
                    <p className="text-[14px] text-[#4b5563] leading-snug">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Which crops */}
            <section className="mb-10">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">Works best with</h2>
              <div className="flex flex-wrap gap-2">
                {practice.appliesTo.map((crop) => (
                  <Link
                    key={crop}
                    href={crop === 'All crops' ? '/crops' : `/crops/${crop.toLowerCase()}`}
                    className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: catMeta.bg, color: catMeta.color, border: `1.5px solid ${catMeta.color}40` }}
                  >
                    {crop}
                  </Link>
                ))}
              </div>
            </section>

            {/* How to do it */}
            <section className="mb-10">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">How to do it</h2>
              <div className="space-y-3">
                {detail.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start bg-white rounded-xl p-4 border border-gray-100">
                    <span
                      className="text-[13px] font-black w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5"
                      style={{ backgroundColor: catMeta.color }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-[14px] text-[#374151] leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cost breakdown */}
            <section className="mb-14">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">Estimated Cost Breakdown</h2>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: catMeta.bg }}>
                      <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: catMeta.color }}>Item</th>
                      <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: catMeta.color }}>Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.costs.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-5 py-3 text-[13px] text-[#374151]">{row.item}</td>
                        <td className="px-5 py-3 text-[13px] text-[#374151] text-right font-medium">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </TracingBeam>
        ) : (
          /* Fallback for practices without full detail — no TracingBeam */
          <div className="mb-14">
            <section className="mb-10">
              <h2 className="text-xl font-black text-[#1a3d0a] mb-4 tracking-tight">Works best with</h2>
              <div className="flex flex-wrap gap-2">
                {practice.appliesTo.map((crop) => (
                  <Link
                    key={crop}
                    href={crop === 'All crops' ? '/crops' : `/crops/${crop.toLowerCase()}`}
                    className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: catMeta.bg, color: catMeta.color, border: `1.5px solid ${catMeta.color}40` }}
                  >
                    {crop}
                  </Link>
                ))}
              </div>
            </section>

            <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-[#9ca3af]">
              <p className="text-[15px] mb-2 font-medium">Full detail guide coming soon.</p>
              <p className="text-[13px]">We are building detailed step-by-step guides for every practice.</p>
            </div>
          </div>
        )}

        {/* Related Practices */}
        <section className="mt-16">
          <h2 className="text-xl font-black text-[#1a3d0a] mb-6 tracking-tight">Related Practices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPractices.map((p) => {
              const pCat = CATEGORY_COLORS[p.category] || CATEGORY_COLORS.traditional;
              const pDiff = difficultyStyle(p.difficulty);
              return (
                <Link key={p.name} href={`/practices/${toSlug(p.name)}`}>
                  <div
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md border"
                    style={{ borderColor: `${pCat.color}30` }}
                  >
                    <div className="h-1.5" style={{ backgroundColor: pCat.color }} />
                    <div className="p-4">
                      <p className="font-bold text-[15px] text-[#1a2a0a] mb-1">{p.name}</p>
                      <p className="text-[12px] text-[#6b7280] leading-snug line-clamp-2">{p.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: pDiff.bg, color: pDiff.text }}>{p.difficulty}</span>
                        <span className="text-[10px] font-semibold text-[#9ca3af]">{costSymbol(p.cost)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 py-16 border-t border-[#c8882a]/10 text-center bg-[#1a3d0a]">
        <div className="text-white font-serif italic text-xl mb-3">Croporia</div>
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.4em]">Farming Practices Wiki • © 2026 • Grown with Care</p>
      </footer>
    </div>
  );
}
