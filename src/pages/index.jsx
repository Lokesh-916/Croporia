import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const STYLE = `
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-snap-type:y mandatory;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;overflow-y:scroll}
  html::-webkit-scrollbar{display:none}
  body{font-family:'Inter',system-ui,sans-serif;background:#143601;color:#fff;overflow-x:hidden}
  #lp-progress{position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#245501,#538d22,#aad576,#cfe1b9);z-index:999;transition:width .15s ease}
  #lp-header{position:fixed;top:0;left:0;width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.4rem 4rem;z-index:200;transition:background .4s ease}
  #lp-header.scrolled{background:rgba(20,54,1,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
  .lp-logo{font-family:'Cinzel',serif;font-weight:400;font-size:1.1rem;letter-spacing:.22em;color:#fff;display:flex;align-items:center;gap:.6rem}
  .lp-logo img{width:28px;height:28px;object-fit:contain}
  .lp-nav{display:flex;align-items:center;gap:2rem}
  .lp-nav a{color:rgba(255,255,255,.7);text-decoration:none;font-size:.85rem;font-weight:400;letter-spacing:.04em;transition:color .2s;cursor:pointer}
  .lp-nav a:hover{color:#aad576}
  .lp-login-btn{padding:.5rem 1.6rem;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font-family:'Inter',sans-serif;font-size:.85rem;font-weight:500;border-radius:3px;cursor:pointer;transition:all .25s ease;letter-spacing:.04em}
  .lp-login-btn:hover{background:#fff;color:#143601;border-color:#fff}
  #lp-dots{position:fixed;right:2rem;top:50%;transform:translateY(-50%);z-index:300;display:flex;flex-direction:column;gap:.6rem}
  .lp-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.25);cursor:pointer;transition:all .3s ease;border:1px solid rgba(255,255,255,.2)}
  .lp-dot.active{background:#aad576;transform:scale(1.4);border-color:#aad576}
  .lp-section{height:100vh;width:100%;scroll-snap-align:start;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
  .lp-video-wrap{position:absolute;inset:0;z-index:0}
  .lp-video-wrap video{width:100%;height:100%;object-fit:cover}
  .lp-video-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,54,1,.3) 0%,rgba(20,54,1,.1) 40%,rgba(20,54,1,.72) 100%)}
  .lp-hero-inner{position:relative;z-index:10;text-align:center;opacity:0;transform:translateY(24px);animation:lpHeroFade 1.2s .3s cubic-bezier(.16,1,.3,1) forwards}
  .lp-eyebrow{font-size:.75rem;letter-spacing:.25em;text-transform:uppercase;color:#aad576;margin-bottom:1.2rem;font-weight:500}
  .lp-h1{font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2.8rem,6vw,5.2rem);line-height:1.1;color:#fff;text-shadow:0 2px 40px rgba(0,0,0,.4);max-width:820px;margin:0 auto 2.5rem}
  .lp-h1 em{font-style:italic;color:#aad576}
  .lp-cta{display:inline-flex;align-items:center;gap:.6rem;padding:.9rem 2.4rem;background:rgba(255,255,255,.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(170,213,118,.5);color:#fff;font-family:'Inter',sans-serif;font-size:.95rem;font-weight:500;border-radius:100px;cursor:pointer;transition:all .4s cubic-bezier(.34,1.56,.64,1);letter-spacing:.02em}
  .lp-cta:hover{background:rgba(170,213,118,.15);border-color:#aad576;transform:scale(1.04);box-shadow:0 0 40px rgba(170,213,118,.2)}
  .lp-scroll-cue{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:.4rem;color:rgba(255,255,255,.5);font-size:.7rem;letter-spacing:.15em;text-transform:uppercase}
  .lp-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,.5),transparent);animation:lpScrollPulse 2s ease-in-out infinite}
  .lp-cluster{padding:0 4rem;justify-content:center}
  .lp-cluster-inner{position:relative;z-index:10;max-width:1200px;margin:0 auto;width:100%}
  #s1{background:#1a4301}
  #s1::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 15% 50%,rgba(36,85,1,.45) 0%,transparent 65%);pointer-events:none}
  #s2{background:#dde5b6;color:#143601}
  #s2::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 65% at 85% 40%,rgba(181,201,154,.55) 0%,transparent 65%);pointer-events:none}
  #s3{background:#f0ead2;color:#143601}
  #s3::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 60% at 10% 60%,rgba(207,225,185,.6) 0%,transparent 65%);pointer-events:none}
  #s4{background:#245501}
  #s4::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 60% at 80% 40%,rgba(83,141,34,.22) 0%,transparent 65%);pointer-events:none}
  .lp-label{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:#aad576;margin-bottom:.5rem;font-weight:500}
  .lp-title{font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.8rem,3.5vw,3rem);line-height:1.15;margin-bottom:.6rem;color:#fff}
  .lp-sub{font-size:.9rem;color:rgba(255,255,255,.5);margin-bottom:2.4rem;font-weight:300;max-width:520px}
  #s2 .lp-label,#s3 .lp-label{color:#538d22}
  #s2 .lp-title,#s3 .lp-title{color:#143601}
  #s2 .lp-sub,#s3 .lp-sub{color:rgba(20,54,1,.55)}
  .lp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
  .lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
  .lp-card{background:rgba(255,255,255,.05);border:1px solid rgba(170,213,118,.2);border-radius:12px;padding:1.4rem 1.2rem;cursor:pointer;opacity:0;transform:translateY(28px);transition:all .3s ease}
  .lp-card.visible{animation:lpCardReveal .6s cubic-bezier(.16,1,.3,1) forwards}
  .lp-card:hover{background:rgba(255,255,255,.09);border-color:rgba(170,213,118,.5);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
  .lp-card:nth-child(1){border-top:2px solid #aad576}
  .lp-card:nth-child(2){border-top:2px solid #73a942}
  .lp-card:nth-child(3){border-top:2px solid #97a97c}
  .lp-card:nth-child(4){border-top:2px solid #cfe1b9}
  .lp-card-title{font-family:'Inter',sans-serif;font-weight:600;font-size:.95rem;color:#fff;margin-bottom:.4rem;letter-spacing:.01em}
  .lp-card-desc{font-size:.8rem;color:rgba(255,255,255,.5);line-height:1.55;font-weight:300}
  .lp-card-tag{display:inline-block;margin-top:1rem;font-size:.67rem;letter-spacing:.12em;text-transform:uppercase;color:#aad576;background:rgba(170,213,118,.12);border:1px solid rgba(170,213,118,.25);padding:.25rem .6rem;border-radius:100px;font-weight:500}
  .lp-card-light{background:#fff;border:1px solid rgba(20,54,1,.1);border-radius:12px;padding:1.4rem 1.2rem;cursor:pointer;opacity:0;transform:translateY(28px);transition:all .3s ease;box-shadow:0 2px 12px rgba(0,0,0,.06)}
  .lp-card-light.visible{animation:lpCardReveal .6s cubic-bezier(.16,1,.3,1) forwards}
  .lp-card-light:hover{border-color:#538d22;box-shadow:0 12px 36px rgba(0,0,0,.1),0 0 0 3px rgba(83,141,34,.07);transform:translateY(-4px)}
  .lp-card-light:nth-child(1){border-top:2px solid #538d22}
  .lp-card-light:nth-child(2){border-top:2px solid #73a942}
  .lp-card-light:nth-child(3){border-top:2px solid #97a97c}
  .lp-card-light .lp-card-title{color:#143601}
  .lp-card-light .lp-card-desc{color:rgba(20,54,1,.6)}
  .lp-card-light .lp-card-tag{color:#538d22;background:rgba(83,141,34,.08);border:1px solid rgba(83,141,34,.2)}
  .lp-tools-grid{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:1.2rem}
  .lp-tool{border-radius:16px;overflow:hidden;position:relative;min-height:240px;cursor:pointer;opacity:0;transform:translateY(28px);transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;border:1px solid rgba(20,54,1,.15)}
  .lp-tool.visible{animation:lpCardReveal .6s cubic-bezier(.16,1,.3,1) forwards}
  .lp-tool:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 60px rgba(0,0,0,.25)}
  .lp-tool-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .5s ease}
  .lp-tool:hover .lp-tool-bg{transform:scale(1.06)}
  .lp-tool-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,54,1,.92) 0%,rgba(20,54,1,.25) 100%)}
  .lp-tool-content{position:absolute;bottom:0;left:0;right:0;padding:1.6rem}
  .lp-tool-title{font-family:'Inter',sans-serif;font-size:1.05rem;font-weight:600;color:#fff;margin-bottom:.3rem}
  .lp-tool-desc{font-size:.78rem;color:rgba(255,255,255,.55);line-height:1.5;font-weight:300}
  .lp-tool-cta{margin-top:.9rem;display:inline-flex;align-items:center;gap:.35rem;font-size:.75rem;font-weight:500;color:#aad576;letter-spacing:.06em;text-transform:uppercase}
  .lp-comm-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:1.2rem;align-items:stretch}
  .lp-comm-hero{background:rgba(255,255,255,.06);border:1px solid rgba(170,213,118,.28);border-radius:16px;padding:2.4rem 2rem;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;opacity:0;transform:translateY(28px);transition:all .35s ease}
  .lp-comm-hero.visible{animation:lpCardReveal .6s cubic-bezier(.16,1,.3,1) forwards}
  .lp-comm-hero:hover{transform:translateY(-5px);border-color:rgba(170,213,118,.55);box-shadow:0 16px 50px rgba(0,0,0,.3);background:rgba(255,255,255,.09)}
  .lp-comm-title{font-family:'Cinzel',serif;font-weight:400;font-size:1.8rem;line-height:1.2;margin-bottom:.6rem;color:#fff}
  .lp-comm-desc{font-size:.85rem;color:rgba(255,255,255,.5);line-height:1.6;font-weight:300;margin-bottom:1.4rem}
  .lp-join-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.8rem;background:#aad576;color:#143601;border-radius:100px;font-size:.85rem;font-weight:600;border:none;cursor:pointer;transition:all .3s ease;font-family:'Inter',sans-serif;letter-spacing:.02em;align-self:flex-start}
  .lp-join-btn:hover{background:#cfe1b9;transform:scale(1.03)}
  #lp-footer{height:100vh;background:#0d2200;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden}
  #lp-footer::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 40%,rgba(83,141,34,.15) 0%,transparent 70%)}
  .lp-footer-inner{position:relative;z-index:10}
  .lp-footer-logo{font-family:'Cinzel',serif;font-weight:400;font-size:1rem;letter-spacing:.25em;color:#aad576;margin-bottom:2rem;display:flex;align-items:center;justify-content:center;gap:.6rem}
  .lp-footer-logo img{width:32px;height:32px;object-fit:contain}
  .lp-footer-tagline{font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2.2rem,5vw,4rem);max-width:700px;line-height:1.1;margin-bottom:2.5rem;color:#fff}
  .lp-footer-tagline em{font-style:italic;color:#aad576}
  .lp-footer-links{display:flex;gap:2rem;justify-content:center;margin-bottom:3rem}
  .lp-footer-links a{color:rgba(255,255,255,.4);text-decoration:none;font-size:.8rem;letter-spacing:.05em;transition:color .2s;cursor:pointer}
  .lp-footer-links a:hover{color:#aad576}
  .lp-footer-copy{font-size:.72rem;color:rgba(255,255,255,.2);letter-spacing:.05em}
  @keyframes lpHeroFade{to{opacity:1;transform:translateY(0)}}
  @keyframes lpCardReveal{to{opacity:1;transform:translateY(0)}}
  @keyframes lpScrollPulse{0%,100%{opacity:.5;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
  .lp-card:nth-child(1),.lp-tool:nth-child(1),.lp-comm-hero{animation-delay:.05s}
  .lp-card:nth-child(2),.lp-tool:nth-child(2){animation-delay:.15s}
  .lp-card:nth-child(3),.lp-tool:nth-child(3){animation-delay:.25s}
  .lp-card:nth-child(4){animation-delay:.35s}
  @media(max-width:900px){.lp-grid4,.lp-tools-grid,.lp-comm-grid{grid-template-columns:1fr 1fr}.lp-grid3{grid-template-columns:1fr}.lp-cluster{padding:0 1.5rem}#lp-header{padding:1rem 1.5rem}.lp-h1{font-size:2.4rem}}
`

export default function Home() {
  const navigate = useNavigate()
  const sectionsRef = useRef([])
  const dotsRef = useRef([])
  const headerRef = useRef(null)
  const progressRef = useRef(null)
  const currentIdx = useRef(0)

  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean)
    const dots = dotsRef.current.filter(Boolean)
    const header = headerRef.current
    const progress = progressRef.current
    if (!sections.length) return

    const scrollToSection = (idx) => sections[idx]?.scrollIntoView({ behavior: 'smooth' })
    dots.forEach(dot => dot.addEventListener('click', () => scrollToSection(parseInt(dot.dataset.idx))))

    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target)
          dots.forEach(d => d.classList.remove('active'))
          if (dots[idx]) dots[idx].classList.add('active')
          if (idx === 0) header?.classList.remove('scrolled')
          else header?.classList.add('scrolled')
          if (progress) progress.style.width = ((idx + 1) / sections.length * 100) + '%'
          currentIdx.current = idx
        }
      })
    }, { threshold: 0.5 })

    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.lp-card,.lp-card-light,.lp-tool,.lp-comm-hero').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 100))
          cardObs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    sections.forEach(s => { sectionObs.observe(s); cardObs.observe(s) })

    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); scrollToSection(Math.min(currentIdx.current + 1, sections.length - 1)) }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); scrollToSection(Math.max(currentIdx.current - 1, 0)) }
    }
    document.addEventListener('keydown', onKey)
    return () => { sectionObs.disconnect(); cardObs.disconnect(); document.removeEventListener('keydown', onKey) }
  }, [])

  const sec = (idx) => (el) => { sectionsRef.current[idx] = el }
  const dot = (idx) => (el) => { dotsRef.current[idx] = el }

  return (
    <>
      <style>{STYLE}</style>
      <div id="lp-progress" ref={progressRef} />

      <nav id="lp-dots">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className={`lp-dot${i===0?' active':''}`} data-idx={i} ref={dot(i)} />
        ))}
      </nav>

      <header id="lp-header" ref={headerRef}>
        <div className="lp-logo">
          <img src="/organic.png" alt="Croporia" />
          CROPORIA
        </div>
        <nav className="lp-nav">
          <a onClick={() => document.getElementById('s1')?.scrollIntoView({behavior:'smooth'})}>Features</a>
          <a onClick={() => document.getElementById('s4')?.scrollIntoView({behavior:'smooth'})}>Community</a>
          <a onClick={() => document.getElementById('lp-footer')?.scrollIntoView({behavior:'smooth'})}>About</a>
          <button className="lp-login-btn" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </header>

      {/* HERO */}
      <section className="lp-section" ref={sec(0)}>
        <div className="lp-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/bali_rice_farm.webm" type="video/webm" />
          </video>
        </div>
        <div className="lp-hero-inner">
          <p className="lp-eyebrow">AI-Powered Agriculture Platform</p>
          <h1 className="lp-h1">The Future of Farming,<br /><em>Rooted in Data.</em></h1>
          <button className="lp-cta" onClick={() => document.getElementById('s1')?.scrollIntoView({behavior:'smooth'})}>
            Enter Croporia
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="lp-scroll-cue">
          <span>Explore</span>
          <div className="lp-scroll-line" />
        </div>
      </section>

      {/* COMMAND CENTER — dark forest green */}
      <section id="s1" className="lp-section lp-cluster" ref={sec(1)}>
        <div className="lp-cluster-inner">
          <p className="lp-label">Command Center</p>
          <h2 className="lp-title">Everything you need<br />in one place.</h2>
          <p className="lp-sub">Your personalised farming intelligence hub — from live crop prices to AI-curated insights.</p>
          <div className="lp-grid4">
            {[
              { title: 'AI Farm Assistant', desc: 'Ask anything about soil, weather, pests, or yields. Get instant RAG-powered answers from your farming knowledge base.', tag: 'AI Powered', to: '/assistant' },
              { title: 'My Farm Dashboard', desc: 'One glance to see your field health, upcoming tasks, soil data, and crop stages across all your registered fields.', tag: 'Analytics', to: '/fields' },
              { title: 'Crop Market', desc: 'Buy and sell crops directly with farmers nearby. List your produce or find fresh crops at fair prices.', tag: 'Live Market', to: '/market' },
              { title: 'Find Best Crop', desc: 'Enter your soil type, climate and season — discover the most profitable crop for your exact conditions.', tag: 'Smart Match', to: '/predictor' },
            ].map(c => (
              <div key={c.title} className="lp-card" onClick={() => navigate(c.to)}>
                <div className="lp-card-title">{c.title}</div>
                <div className="lp-card-desc">{c.desc}</div>
                <span className="lp-card-tag">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIELD TOOLS — cream/tea green light bg */}
      <section id="s2" className="lp-section lp-cluster" ref={sec(2)}>
        <div className="lp-cluster-inner">
          <p className="lp-label">Field Tools</p>
          <h2 className="lp-title">Precision tools for<br />the modern grower.</h2>
          <p className="lp-sub">Built for real decisions — simulate, track, and identify before it costs you.</p>
          <div className="lp-tools-grid">
            {[
              { bg: 'linear-gradient(135deg,#143601 0%,#245501 100%)', title: 'Crop Simulator', desc: 'Model planting timelines, expected yields, and growth stages before you sow a single seed.', cta: 'Try Simulator', to: '/simulator' },
              { bg: 'linear-gradient(135deg,#0d2200 0%,#1a4301 60%,#245501 100%)', title: 'Yield Predictor', desc: 'Enter your soil, weather, and field data. Get a precise yield and revenue forecast powered by AI.', cta: 'Predict Yield', to: '/predictor' },
              { bg: 'linear-gradient(135deg,#1a4301 0%,#2d6b00 100%)', title: 'Pest Identifier', desc: 'Photograph a leaf or describe symptoms — our AI diagnoses the pest or disease and recommends treatment.', cta: 'Identify Now', to: '/pest-health' },
            ].map(t => (
              <div key={t.title} className="lp-tool" onClick={() => navigate(t.to)}>
                <div className="lp-tool-bg" style={{background: t.bg}} />
                <div className="lp-tool-overlay" />
                <div className="lp-tool-content">
                  <div className="lp-tool-title">{t.title}</div>
                  <div className="lp-tool-desc">{t.desc}</div>
                  <div className="lp-tool-cta">
                    {t.cta}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KNOWLEDGE HUB — vanilla cream light bg */}
      <section id="s3" className="lp-section lp-cluster" ref={sec(3)}>
        <div className="lp-cluster-inner">
          <p className="lp-label">Knowledge Hub</p>
          <h2 className="lp-title">Learn. Reference.<br />Grow smarter.</h2>
          <p className="lp-sub">A living library built for farmers — curated by agronomists and updated continuously.</p>
          <div className="lp-grid3">
            {[
              { title: 'Smart Learning', desc: 'Deep-dive courses on soil health, irrigation, IPM, crop planning, and farming economics — with quizzes that test real understanding.', tag: '5 Courses', to: '/learn' },
              { title: 'Crop Encyclopedia', desc: 'Detailed profiles for 43+ Indian crops — growth requirements, harvest windows, real costs, and step-by-step cultivation guides.', tag: '43+ Crops', to: '/crops' },
              { title: 'Practices Wiki', desc: 'Proven and emerging farming practices — from organic certification to precision micro-irrigation, explained in plain language.', tag: 'Field Tested', to: '/practices' },
            ].map(c => (
              <div key={c.title} className="lp-card lp-card-light" onClick={() => navigate(c.to)}>
                <div className="lp-card-title">{c.title}</div>
                <div className="lp-card-desc">{c.desc}</div>
                <span className="lp-card-tag">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY — olive leaf dark bg */}
      <section id="s4" className="lp-section lp-cluster" ref={sec(4)}>
        <div className="lp-cluster-inner">
          <p className="lp-label">Community</p>
          <h2 className="lp-title">Farming is better<br />together.</h2>
          <p className="lp-sub">Connect with agronomists, share field knowledge, and grow your network alongside your crops.</p>
          <div className="lp-comm-grid">
            <div className="lp-comm-hero" onClick={() => navigate('/signup')}>
              <div>
                <div className="lp-comm-title">Join the Croporia Community</div>
                <div className="lp-comm-desc">Thousands of farmers sharing real-time advice, crop updates, and local market knowledge. Your most useful farming tool might just be the farmer next door.</div>
              </div>
              <button className="lp-join-btn">
                Create Free Account
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="lp-card" onClick={() => navigate('/experts')}>
              <div className="lp-card-title">Talk to Experts</div>
              <div className="lp-card-desc">Connect with certified agronomists, soil scientists, and crop specialists. Send messages and get guidance in regional languages.</div>
              <span className="lp-card-tag">Live Consultation</span>
            </div>
            <div className="lp-card" onClick={() => navigate('/community')}>
              <div className="lp-card-title">Community Forum</div>
              <div className="lp-card-desc">Post questions, share discoveries, and learn from farmers across different climates and crop types.</div>
              <span className="lp-card-tag">Active Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section id="lp-footer" className="lp-section" ref={sec(5)}>
        <div className="lp-footer-inner">
          <div className="lp-footer-logo">
            <img src="/organic.png" alt="Croporia" />
            CROPORIA
          </div>
          <h2 className="lp-footer-tagline">Where data meets<br /><em>the soil.</em></h2>
          <div className="lp-footer-links">
            <a onClick={() => navigate('/crops')}>Crop Wiki</a>
            <a onClick={() => navigate('/practices')}>Practices</a>
            <a onClick={() => navigate('/community')}>Community</a>
            <a onClick={() => navigate('/experts')}>Experts</a>
            <a onClick={() => navigate('/market')}>Market</a>
          </div>
          <p className="lp-footer-copy">2026 Croporia Technologies · Built for the modern farmer</p>
        </div>
      </section>
    </>
  )
}
