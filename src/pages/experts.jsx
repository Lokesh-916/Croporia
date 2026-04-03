import { useMemo, useState, useEffect } from "react"
import { Star, MapPin, Clock, Send, X, Users, Wheat, Award } from "lucide-react"
import Navbar from "../components/Navbar"
const DATA = [
  { _id:"e1", name:"Dr. Santosh Verma", responseTime:"Under 10 min", highlight:"Increased wheat yields by 22% across 300+ farms.", expertDetails:{ specialization:"Soil & Nutrient Management", region:"Punjab, India", experience:"18+ years", crops:"Wheat, Paddy, Maize", languages:["English","Hindi","Punjabi"], rating:4.9, achievements:["Nutrient plans for 5,000+ acres","Low-cost composting","12+ research papers"] } },
  { _id:"e2", name:"Anita Kulkarni", responseTime:"Within 20 min", highlight:"Transforms orchards into export-ready plantations.", expertDetails:{ specialization:"Fruit Orchard Specialist", region:"Maharashtra, India", experience:"12 years", crops:"Mango, Pomegranate, Citrus", languages:["English","Marathi","Hindi"], rating:4.8, achievements:["Revived 150+ orchards","Trained 1000+ farmers","Consulted 3 FPOs"] } },
  { _id:"e3", name:"Rahul Menon", responseTime:"Within 30 min", highlight:"Builds crop plans for erratic rainfall.", expertDetails:{ specialization:"Climate-Smart Farming", region:"Karnataka, India", experience:"9 years", crops:"Millets, Pulses, Vegetables", languages:["English","Kannada","Hindi"], rating:4.7, achievements:["800+ farmers shifted to millets","Rainwater harvesting","State govt advisor"] } },
  { _id:"e4", name:"Dr. Asha Nair", responseTime:"Online now", highlight:"IPM with minimal chemical load.", expertDetails:{ specialization:"Plant Protection & IPM", region:"Andhra Pradesh, India", experience:"15+ years", crops:"Rice, Cotton, Chilli", languages:["English","Telugu","Hindi"], rating:5.0, achievements:["Reduced pesticide use 40%","Weekly field clinics","Trained 300+ scouts"] } },
]
function getBg(n){const c=["bg-forest","bg-dusty","bg-olive-leaf","bg-black-forest-light","bg-palm-dark"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}
function getIn(n){return n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
export default function Experts() {
  const [list,setList]=useState(DATA)
  const [loading,setLoading]=useState(true)
  const [selId,setSelId]=useState("e1")
  const [msgTarget,setMsgTarget]=useState(null)
  const [msg,setMsg]=useState("")
  const [sent,setSent]=useState(false)
  useEffect(()=>{
    fetch("http://localhost:5000/api/experts").then(r=>r.json()).then(data=>{if(Array.isArray(data)&&data.length>0){setList(data);setSelId(data[0]._id)}}).catch(()=>{}).finally(()=>setLoading(false))
  },[])
  const sel=useMemo(()=>list.find(e=>e._id===selId)||list[0],[selId,list])
  const d=sel?(sel.expertDetails||{}):{}
  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <header className="mb-8">
          <p className="text-[11px] font-bold text-forest uppercase tracking-[0.22em] mb-2">Croporia - Experts</p>
          <h1 className="font-cinzel text-4xl font-black text-black-forest mb-2">Talk to Experts</h1>
          <p className="text-sm text-ash max-w-xl">Get guidance from agriculture specialists who understand soil, seasons, and your reality.</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest bg-frosted border border-olive/30 px-3 py-1 rounded-full mt-3"><Users className="w-3 h-3" /> {list.length} experts available</span>
        </header>
        {loading?(<div className="flex items-center gap-3 text-sm text-ash py-16 justify-center"><div className="w-5 h-5 border-4 border-olive/30 border-t-forest rounded-full animate-spin" />Loading...</div>):(
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <aside className="rounded-3xl border border-olive/30 bg-white/70 p-4">
              <p className="text-[11px] font-bold text-ash uppercase tracking-widest mb-3 px-1">Choose your expert</p>
              <div className="max-h-[480px] overflow-y-auto pr-1">
                {list.map(e=>{
                  const ed=e.expertDetails||{};const active=e._id===selId
                  return (<button key={e._id} type="button" onClick={()=>setSelId(e._id)} className={active?"w-full text-left rounded-2xl border border-forest bg-frosted shadow-sm px-4 py-3.5 mb-3 flex items-center gap-3":"w-full text-left rounded-2xl border border-olive/30 bg-white hover:border-palm px-4 py-3.5 mb-3 flex items-center gap-3"}>
                    <div className={getBg(e.name)+" flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"}>{getIn(e.name)}</div>
                    <div className="flex-1 min-w-0"><p className="truncate text-sm font-semibold text-black-forest">{e.name}</p><p className="mt-0.5 text-xs text-forest">{ed.specialization}</p><p className="mt-0.5 text-[11px] text-ash truncate">{ed.region}</p></div>
                  </button>)
                })}
              </div>
            </aside>
            <section className="min-h-[400px]">
              {sel&&(
                <div className="flex h-full flex-col rounded-3xl border border-olive/30 bg-white/90 shadow-sm overflow-hidden">
                  <div className="border-b border-olive/20 px-6 py-5 bg-frosted/60">
                    <div className="flex items-start gap-4">
                      <div className={getBg(sel.name)+" flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shrink-0"}>{getIn(sel.name)}</div>
                      <div className="flex-1"><h2 className="font-cinzel font-bold text-xl text-black-forest">{sel.name}</h2><p className="text-sm text-forest font-medium">{d.specialization}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-ash"><MapPin className="w-3 h-3" /> {d.region}</span>
                          <span className="flex items-center gap-1 text-[11px] text-copper font-semibold"><Star className="w-3 h-3" /> {(d.rating||5).toFixed(1)}</span>
                          <span className="flex items-center gap-1 text-[11px] text-ash"><Clock className="w-3 h-3" /> {sel.responseTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {sel.highlight&&<div className="bg-frosted rounded-2xl px-4 py-3 border border-olive/20"><p className="text-sm text-black-forest italic">{sel.highlight}</p></div>}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-vanilla rounded-xl px-4 py-3 border border-cream"><p className="text-[10px] font-bold text-ash uppercase tracking-widest mb-1 flex items-center gap-1"><Wheat className="w-3 h-3" /> Crops</p><p className="text-xs text-black-forest font-medium">{d.crops||"no data"}</p></div>
                      <div className="bg-vanilla rounded-xl px-4 py-3 border border-cream"><p className="text-[10px] font-bold text-ash uppercase tracking-widest mb-1">Languages</p><p className="text-xs text-black-forest font-medium">{Array.isArray(d.languages)?d.languages.join(", "):(d.languages||"no data")}</p></div>
                    </div>
                    <div><p className="text-[11px] font-bold text-ash uppercase tracking-widest mb-2 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Experience</p><p className="text-xs text-ash mb-3">{d.experience}</p>
                      {Array.isArray(d.achievements)&&d.achievements.map((a,i)=>(<div key={i} className="flex items-start gap-2 text-xs text-black-forest mb-1"><span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />{a}</div>))}
                    </div>
                  </div>
                  <div className="border-t border-olive/20 px-6 py-4 bg-white">
                    <button onClick={()=>{setMsgTarget(sel);setSent(false);setMsg("")}} className="w-full bg-black-forest hover:bg-forest text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"><Send className="w-4 h-4" /> Send a Message</button>
                    <p className="text-center text-[11px] text-ash mt-2">Messages delivered directly to the expert.</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      {msgTarget&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-olive/30 shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3"><div className={getBg(msgTarget.name)+" w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"}>{getIn(msgTarget.name)}</div><div><p className="font-cinzel font-bold text-black-forest">{msgTarget.name}</p><p className="text-xs text-ash">{msgTarget.expertDetails?.specialization}</p></div></div>
              <button onClick={()=>setMsgTarget(null)} className="w-8 h-8 flex items-center justify-center rounded-full border border-olive/40 text-ash hover:bg-frosted"><X className="w-4 h-4" /></button>
            </div>
            {sent?(
              <div className="text-center py-8"><div className="w-14 h-14 bg-frosted rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-6 h-6 text-forest" /></div><p className="font-cinzel font-bold text-black-forest text-lg mb-2">Message Sent</p><p className="text-sm text-ash">Delivered to {msgTarget.name.split(" ")[0]}.</p><button onClick={()=>setMsgTarget(null)} className="mt-6 px-6 py-2.5 bg-black-forest text-white rounded-full text-sm font-semibold hover:bg-forest transition-colors">Close</button></div>
            ):(
              <form onSubmit={e=>{e.preventDefault();if(msg.trim())setSent(true)}} className="space-y-4">
                <textarea rows={4} required placeholder="Describe your farm situation..." className="w-full bg-frosted/50 px-4 py-3 rounded-xl text-sm text-black-forest border border-olive/40 outline-none resize-none focus:border-forest" value={msg} onChange={e=>setMsg(e.target.value)} />
                <button type="submit" className="w-full bg-black-forest hover:bg-forest text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"><Send className="w-4 h-4" /> Send Message</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}