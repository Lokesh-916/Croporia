import { Link } from 'react-router-dom'
import { Leaf, BookOpen, Sprout, ShieldCheck, GraduationCap, Users, Bot, LineChart, ThermometerSun, MessagesSquare, ArrowRight, CloudRain } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Home() {
  const features = [
    { title: 'Crop Wiki & Insights', desc: 'Explore 43+ detailed crop profiles with soil prerequisites, harvest cycles, and real-time conditions.', icon: <BookOpen className="w-8 h-8 text-black-forest" />, color: 'bg-frosted', to: '/crops' },
    { title: 'Farming Practices', desc: 'Master traditional, tech-driven, and organic farming techniques through step-by-step guides.', icon: <Sprout className="w-8 h-8 text-forest" />, color: 'bg-tea', to: '/practices' },
    { title: 'Farm Management', desc: 'Digitize your fields. Track crop plans, soil test values, and calculate total acreage professionally.', icon: <Leaf className="w-8 h-8 text-olive-leaf" />, color: 'bg-olive', to: '/fields' },
    { title: 'Crop Yield Predictor', desc: 'Harness AI to predict your precise yield and revenue given exact weather and soil data points.', icon: <LineChart className="w-8 h-8 text-ash" />, color: 'bg-vanilla', to: '/predictor' },
    { title: 'Climate Simulator', desc: 'Fast forward time. Simulate rain, heatwaves, or frost to see how your crops will react virtually.', icon: <ThermometerSun className="w-8 h-8 text-copper" />, color: 'bg-cream', to: '/simulator' },
    { title: 'Pest & Disease Scanner', desc: 'Identify early-stage leaf diseases in seconds. Upload a photo and let our AI diagnose it instantly.', icon: <ShieldCheck className="w-8 h-8 text-black-forest-light" />, color: 'bg-willow', to: '/pest-health' },
    { title: 'Smart Learning Courses', desc: 'Upskill rapidly with structured farming courses. Watch lessons, take quizzes, and earn certificates.', icon: <GraduationCap className="w-8 h-8 text-sage" />, color: 'bg-frosted', to: '/learn' },
    { title: 'Talk to Experts', desc: 'Connect directly with certified agronomists and experienced local farmers to solve complex issues.', icon: <MessagesSquare className="w-8 h-8 text-dusty" />, color: 'bg-tea', to: '/experts' },
    { title: 'Croporia Community', desc: 'Share your daily struggles, successes, and local wisdom with an active network of modern farmers.', icon: <Users className="w-8 h-8 text-forest" />, color: 'bg-olive', to: '/community' },
    { title: 'AI Farm Assistant', desc: 'Ask anything about crops, soil, pests, or seasons. Powered by RAG over curated farming knowledge.', icon: <Bot className="w-8 h-8 text-black-forest" />, color: 'bg-vanilla', to: '/assistant' },
    { title: 'Crop Market', desc: 'List your produce or find fresh crops from farmers near you. Direct farm-to-buyer connections.', icon: <ArrowRight className="w-8 h-8 text-copper" />, color: 'bg-cream', to: '/market' },
  ]

  return (
    <div className="bg-vanilla min-h-screen font-sans">
      <Navbar />
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32 px-6">
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[800px] h-[800px] bg-tea rounded-full blur-[120px] opacity-40 mix-blend-multiply pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-olive rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-olive bg-white/40 backdrop-blur-sm mb-8 shadow-sm">
            <img src="/organic.png" alt="Croporia" className="w-5 h-5 object-contain" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-olive-leaf">Modern Farming Redefined</span>
          </div>
          <h1 className="font-cinzel font-black text-6xl md:text-8xl text-black-forest leading-[1.1] mb-6 tracking-tight">
            Cultivate the<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-olive-leaf">Future of Farming</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-ash font-medium leading-relaxed mb-10">
            Croporia is the all-in-one ecosystem for the next generation of agriculture. Track your fields, predict your yield, spot diseases, and learn the science of soil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/crops" className="w-full sm:w-auto px-8 py-4 bg-black-forest hover:bg-forest text-white rounded-full font-bold transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">Explore the Wiki <ArrowRight className="w-5 h-5" /></Link>
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white border border-olive text-black-forest hover:bg-frosted rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2">Join Croporia Free</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/60 border-t border-olive/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-cinzel text-5xl font-black text-black-forest mb-4">A Complete Ecosystem</h2>
            <p className="text-ash font-medium max-w-xl mx-auto">Everything you need to plan, protect, and profit from your harvest.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Link key={idx} to={feature.to} className="group relative bg-white border border-tea hover:border-palm rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block">
                <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[40px] opacity-50 transition-transform group-hover:scale-150 ${feature.color}`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-black/5 ${feature.color}`}>{feature.icon}</div>
                  <h3 className="font-cinzel font-bold text-2xl text-black-forest mb-3">{feature.title}</h3>
                  <p className="text-sm font-medium text-ash leading-relaxed mb-6">{feature.desc}</p>
                  <div className="flex items-center text-xs font-bold text-forest uppercase tracking-widest gap-1 group-hover:gap-2 transition-all"><span>Access Tool</span> <ArrowRight className="w-4 h-4" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-black-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <CloudRain className="w-16 h-16 text-willow mx-auto mb-6 opacity-80" />
          <h2 className="font-cinzel text-4xl md:text-5xl font-black text-white mb-6">Ready to grow smarter?</h2>
          <p className="text-tea text-lg mb-10 max-w-xl mx-auto">Stop guessing the weather and guessing the yield. Bring precision data and expert knowledge straight into your farm today.</p>
          <Link to="/signup" className="inline-block px-10 py-5 bg-willow hover:bg-white text-black-forest rounded-full font-black text-lg transition-all shadow-2xl hover:-translate-y-1">Create Your Farm Account</Link>
        </div>
      </section>

      <footer className="bg-black-forest-light py-10 border-t border-forest">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/organic.png" alt="Croporia" className="w-6 h-6 object-contain opacity-50 grayscale" />
            <span className="font-cinzel font-bold text-xl text-olive">Croporia</span>
          </div>
          <p className="text-[11px] font-semibold text-tea uppercase tracking-[0.2em]">2026 Grown with intelligent care</p>
        </div>
      </footer>
    </div>
  )
}
