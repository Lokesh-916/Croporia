import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CropDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchCrop = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/crops/${slug}`);
        if (res.status === 200) {
          const data = await res.json();
          setCrop(data);
        } else {
          setCrop(null);
        }
      } catch (error) {
        console.error('Failed to fetch crop:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D5A27]"></div>
    </div>
  );
  
  if (!crop) return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-black text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-8 font-medium">Crop not found in this patch.</p>
      <Link href="/crops" className="bg-[#2D5A27] text-white px-8 py-3 rounded-full font-bold shadow-lg">
        Back to Wiki
      </Link>
    </div>
  );

  const totalCost = crop.expenses.reduce((sum, e) => sum + e.cost_inr, 0);

  const getBadgeColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'vegetable': return 'bg-green-100 text-green-800 border-green-200';
      case 'fruit': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'field crop': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'herbs & spices': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-sans pb-20">
      {/* Top Section - Hero Style */}
      <div className="bg-[#2D5A27] text-[#FDFCFB] pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle Leaf Pattern Background */}
        <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
          <svg className="w-[600px] h-[600px] text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11,20 13.84,18.78 15.82,16.59C13,16.59 10.5,15.1 8.82,12.91C12,12.91 14.5,14.4 16.18,16.59C18.16,14.4 21,13.18 23.87,13.18C23.1,11.18 21.03,8 17,8Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/crops" className="inline-flex items-center text-white/70 hover:text-white font-bold mb-10 transition-colors group">
            <svg className="w-6 h-6 mr-3 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Wiki
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className={`inline-block text-xs font-black px-4 py-2 rounded-xl mb-6 uppercase tracking-[0.2em] border-2 shadow-sm ${getBadgeColor(crop.category)}`}>
                {crop.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{crop.name}</h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-medium leading-relaxed italic">
                "{crop.summary}"
              </p>
            </div>
            {/* Visual anchor */}
            <div className="hidden md:block w-48 h-48 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20">
              <span className="text-white text-9xl font-black opacity-30 select-none uppercase">{crop.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Conditions Section - 4 cards in a row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'SOIL', value: crop.conditions.soil, icon: 'M5 13l4 4L19 7' },
                { label: 'WATER', value: crop.conditions.water, icon: 'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z' },
                { label: 'CLIMATE', value: crop.conditions.climate, icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-4.773L4.045 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
                { label: 'SEASON', value: crop.conditions.season, icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{item.value}</p>
                </div>
              ))}
            </section>

            {/* Expenses Section */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#ECFDF5] text-[#059669] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Estimated Expenses (per Acre)
              </h2>
              <div className="overflow-hidden rounded-2xl border border-gray-50">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Investment Item</th>
                      <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {crop.expenses.map((e, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 text-gray-700 font-medium">{e.item}</td>
                        <td className="px-6 py-4 text-right text-gray-900 font-bold">₹{e.cost_inr.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#2D5A27] text-white">
                    <tr>
                      <td className="px-6 py-5 text-sm font-black uppercase tracking-widest">Total Estimated Cost</td>
                      <td className="px-6 py-5 text-right text-2xl font-black">₹{totalCost.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Process Section - Boxed numbered steps */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#F59E0B]/10 text-[#D97706] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </span>
                Cultivation Process
              </h2>
              <div className="space-y-4">
                {crop.process.map((step, i) => (
                  <div key={i} className="bg-[#F9FAFB] p-6 rounded-2xl flex gap-6 items-start group hover:bg-white hover:shadow-md transition-all border border-gray-50 hover:border-[#2D5A27]/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-lg font-black text-[#2D5A27] border border-gray-100 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium pt-1.5">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Time Section - 2 stat boxes */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-[#2D5A27] p-6 rounded-3xl text-white shadow-lg flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Germination</p>
                <p className="text-3xl font-black mb-1">{crop.time.germination_days}</p>
                <p className="text-[10px] font-bold uppercase opacity-70">Days</p>
              </div>
              <div className="bg-[#D97706] p-6 rounded-3xl text-white shadow-lg flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Harvest</p>
                <p className="text-3xl font-black mb-1">{crop.time.harvest_days}</p>
                <p className="text-[10px] font-bold uppercase opacity-70">Days</p>
              </div>
            </section>

            {/* Labour Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                 <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 Labour Needs
               </h3>
               <div className="space-y-6">
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Intensity</span>
                    <span className="inline-block px-4 py-2 bg-[#2D5A27] text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-sm">
                      {crop.labour.intensity}
                    </span>
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Workforce / Acre</span>
                    <p className="text-2xl font-black text-gray-900">{crop.labour.workers_per_acre} <small className="text-xs font-bold text-gray-400">Workers</small></p>
                 </div>
                 <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 italic leading-relaxed">"{crop.labour.notes}"</p>
                 </div>
               </div>
            </section>

            {/* Resources Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6">Required Resources</h3>
              <ul className="space-y-4">
                {[
                  { label: 'Seeds', value: crop.resources.seeds, color: 'text-green-600' },
                  { label: 'Fertilizer', value: crop.resources.fertilizer, color: 'text-blue-600' },
                  { label: 'Pesticides', value: crop.resources.pesticides, color: 'text-red-600' }
                ].map((res, i) => (
                  <li key={i} className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{res.label}</span>
                    <span className="text-sm font-bold text-gray-800">{res.value}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Watchouts Section - Red-tinted warning cards */}
            <section className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 pl-2">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Critical Watchouts
              </h3>
              {crop.watchouts.map((note, i) => (
                <div key={i} className="bg-red-50 p-5 rounded-2xl border-2 border-red-100 flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-red-900 leading-normal pt-1">{note}</p>
                </div>
              ))}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
