import { useMemo, useState } from 'react'

const EXPERTS = [
  {
    id: 'soil-santosh',
    name: 'Dr. Santosh Verma',
    role: 'Soil & Nutrient Management',
    region: 'Punjab, India',
    experience: '18+ years advising small and mid-size farms',
    crops: 'Wheat · Paddy · Maize · Fodder crops',
    languages: ['English', 'Hindi', 'Punjabi'],
    responseTime: 'Usually replies in under 10 minutes',
    rating: 4.9,
    avatarBg: 'bg-emerald-700',
    initials: 'SV',
    highlight:
      'Helped increase average wheat yields by 22% across 300+ farms using soil-health-first plans.',
    achievements: [
      'Designed region-specific nutrient plans for over 5,000 acres',
      'Set up low-cost on-farm composting systems for marginal farmers',
      'Published 12+ papers on soil organic carbon and water retention',
    ],
  },
  {
    id: 'orchard-anita',
    name: 'Anita Kulkarni',
    role: 'Fruit Orchard Specialist',
    region: 'Maharashtra, India',
    experience: '12 years in horticulture and integrated farming',
    crops: 'Mango · Pomegranate · Citrus · Banana',
    languages: ['English', 'Marathi', 'Hindi'],
    responseTime: 'Active today · replies within 20 minutes',
    rating: 4.8,
    avatarBg: 'bg-amber-700',
    initials: 'AK',
    highlight:
      'Transforms unproductive orchards into high-density, export-ready plantations.',
    achievements: [
      'Revived 150+ ageing orchards with pruning and fertigation plans',
      'Trained 1,000+ farmers on drip irrigation and mulching',
      'Consulted for 3 FPOs on residue-free fruit production',
    ],
  },
  {
    id: 'climate-rahul',
    name: 'Rahul Menon',
    role: 'Climate-Smart Farming',
    region: 'Karnataka, India',
    experience: '9 years working on climate resilience',
    crops: 'Millets · Pulses · Vegetables',
    languages: ['English', 'Kannada', 'Hindi'],
    responseTime: 'Usually replies in under 30 minutes',
    rating: 4.7,
    avatarBg: 'bg-lime-700',
    initials: 'RM',
    highlight:
      'Builds crop plans that can handle erratic rainfall and rising temperatures.',
    achievements: [
      'Helped 800+ farmers shift part of area to climate-resilient millets',
      'Designed low-cost rainwater harvesting structures for dryland farms',
      'Works with 2 state governments on climate-smart schemes',
    ],
  },
  {
    id: 'plant-asha',
    name: 'Dr. Asha Nair',
    role: 'Plant Protection & IPM',
    region: 'Andhra Pradesh, India',
    experience: '15+ years in pest & disease management',
    crops: 'Rice · Cotton · Chilli · Vegetables',
    languages: ['English', 'Telugu', 'Hindi'],
    responseTime: 'Online now · fast replies',
    rating: 5.0,
    avatarBg: 'bg-emerald-800',
    initials: 'AN',
    highlight:
      'Prefers integrated pest management with minimal chemical load on soil and farmer.',
    achievements: [
      'Reduced pesticide usage by up to 40% while maintaining yields',
      'Runs weekly “field clinic” for farmer groups across 4 districts',
      'Trained 300+ scouts to identify pests at early stages',
    ],
  },
]

const SAMPLE_CONVERSATIONS = {
  'soil-santosh': [
    {
      from: 'farmer',
      text: 'My wheat crop is yellowing in patches. What should I check first?',
      time: '09:10',
    },
    {
      from: 'expert',
      text: 'Start with soil moisture and root health. Gently dig near affected plants and send me a close-up photo of roots and soil.',
      time: '09:13',
    },
    {
      from: 'expert',
      text: 'Also share your last 2 fertilizer applications and irrigation dates. We will rule out nitrogen deficiency vs waterlogging.',
      time: '09:15',
    },
  ],
  'orchard-anita': [
    {
      from: 'farmer',
      text: 'My 8-year-old mango trees are flowering but fruit drop is very high.',
      time: '17:40',
    },
    {
      from: 'expert',
      text: 'Share spacing, pruning history and last year’s yield. We may need to correct canopy balance and pre-flowering nutrition.',
      time: '17:44',
    },
    {
      from: 'expert',
      text: 'Don’t worry, with 2 seasons of corrective care we can stabilise both fruit set and size.',
      time: '17:46',
    },
  ],
  'climate-rahul': [
    {
      from: 'farmer',
      text: 'Rainfall has become unpredictable. Which crops should I prioritise on my 4 acres?',
      time: '08:02',
    },
    {
      from: 'expert',
      text: 'We’ll mix resilient millets with a small portion of vegetables for cash flow. I’ll design a 3-year rotation that suits your soil and water.',
      time: '08:06',
    },
  ],
  'plant-asha': [
    {
      from: 'farmer',
      text: 'Leaf curling and tiny insects on the underside of chilli leaves.',
      time: '13:21',
    },
    {
      from: 'expert',
      text: 'Sounds like an early-stage sucking pest. I’ll suggest a safe spray + yellow sticky traps. Please avoid broad-spectrum chemicals right now.',
      time: '13:24',
    },
  ],
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100">
      {children}
    </span>
  )
}

function InfoIconButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-emerald-100 bg-emerald-50/70 text-emerald-700 text-xs font-semibold shadow-sm hover:bg-emerald-100 hover:border-emerald-200 transition-colors"
      aria-label="About this expert"
    >
      i
    </button>
  )
}

function ExpertCard({ expert, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border px-4 py-3.5 mb-3 flex items-center gap-3 transition-all ${
        isActive
          ? 'border-emerald-500/80 bg-emerald-50 shadow-soft shadow-emerald-900/10'
          : 'border-emerald-100/70 bg-farm-card/80 hover:border-emerald-400/80 hover:bg-emerald-50'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-emerald-50 ${expert.avatarBg}`}
      >
        {expert.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-slate-900">
            {expert.name}
          </p>
          <span className="text-xs text-amber-700 bg-amber-100/80 rounded-full px-1.5 py-0.5">
            ★ {expert.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-emerald-900/80">{expert.role}</p>
        <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
          {expert.region} · {expert.crops}
        </p>
      </div>
    </button>
  )
}

function InfoPanel({ expert, isOpen, onClose }) {
  if (!expert) return null

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-20 flex items-end justify-center md:items-center md:justify-end p-4 md:p-8 transition ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`pointer-events-auto max-w-md w-full rounded-3xl border border-emerald-100/80 bg-white/95 shadow-soft backdrop-blur-md transform transition-all ${
          isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-4 md:translate-x-4'
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-emerald-50">
          <div>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="font-heading text-lg text-emerald-800">
                {expert.name}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-emerald-900/80">{expert.role}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {expert.region} · {expert.experience}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 text-xs hover:bg-slate-50"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-3 space-y-3 text-xs text-slate-700">
          <p className="text-[13px] leading-relaxed text-emerald-950">
            {expert.highlight}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Badge>{expert.crops}</Badge>
            <Badge>Speaks: {expert.languages.join(', ')}</Badge>
            <Badge>{expert.responseTime}</Badge>
          </div>

          <div className="pt-1.5 border-t border-emerald-50">
            <p className="font-medium text-slate-900 mb-1.5">Field impact</p>
            <ul className="list-disc list-inside space-y-1.5">
              {expert.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatWindow({ expert, onInfoClick }) {
  const conversation = SAMPLE_CONVERSATIONS[expert.id] ?? []

  const greeting = useMemo(
    () =>
      `Tell me about your farm — location, crops, and biggest worry this season. I'll help you plan the next best step.`,
    [expert.id],
  )

  return (
    <div className="flex h-full flex-col rounded-3xl border border-emerald-100/80 bg-white/90 shadow-soft backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-emerald-50 ${expert.avatarBg}`}
          >
            {expert.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading text-lg text-emerald-900">
                {expert.name}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-600">{expert.role}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {expert.region} · {expert.responseTime}
            </p>
          </div>
        </div>
        <InfoIconButton onClick={onInfoClick} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-farm-sky/70 via-emerald-50/60 to-farm-soilSoft/60">
        <div className="mx-auto mb-2 max-w-xs rounded-full bg-emerald-900/90 px-3 py-1 text-center text-[11px] font-medium text-emerald-50 shadow-sm">
          You’re in a safe, judgement-free space. Share your real farm situation.
        </div>

        {conversation.map((msg, idx) => {
          const isFarmer = msg.from === 'farmer'
          return (
            <div
              key={`${expert.id}-${idx}`}
              className={`flex w-full ${isFarmer ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2.5 text-sm shadow-sm ${
                  isFarmer
                    ? 'bg-white/90 text-slate-900 border border-emerald-100/70'
                    : 'bg-emerald-700 text-emerald-50'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isFarmer ? 'text-slate-400' : 'text-emerald-100/80'
                  }`}
                >
                  {isFarmer ? 'You' : expert.name.split(' ')[0]} · {msg.time}
                </p>
              </div>
            </div>
          )
        })}

        <div className="mt-2 max-w-md rounded-2xl border border-dashed border-emerald-300/80 bg-emerald-50/70 px-3 py-2.5 text-xs text-emerald-900">
          <p className="font-medium mb-1">Next, your expert will ask:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Where is your farm and what is your soil type?</li>
            <li>What crops are you planning this season?</li>
            <li>What went wrong (or right) in the last season?</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-100 bg-white/95 px-4 py-3">
        <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900 mb-2">
          {greeting}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-2xl border border-emerald-100/80 bg-white px-3 py-2 text-xs text-slate-500">
            Type your question here when chat is enabled…
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-50 shadow-sm opacity-60 cursor-not-allowed"
          >
            <span>Send</span>
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Chat is in preview mode – this is a UI-only mock. Real-time messaging will
          be wired to Croporia later.
        </p>
      </div>
    </div>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState(EXPERTS[0].id)
  const [infoOpen, setInfoOpen] = useState(false)

  const selectedExpert = useMemo(
    () => EXPERTS.find((e) => e.id === selectedId) ?? EXPERTS[0],
    [selectedId],
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-6">
      <main className="w-full max-w-6xl rounded-[32px] border border-emerald-100/80 bg-white/85 shadow-soft backdrop-blur-md px-4 py-5 md:px-8 md:py-7">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Croporia
            </p>
            <h1 className="mt-1 font-heading text-3xl md:text-4xl text-emerald-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              Talk to Experts
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Real farmers. Real problems. Get guidance from agriculture specialists
              who understand soil, seasons, and your reality on the field.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>New age farmer assistance</Badge>
            <Badge>1:1 expert conversations</Badge>
          </div>
        </header>

        <section className="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          <aside className="rounded-3xl border border-emerald-100/80 bg-gradient-to-b from-farm-soilSoft/80 via-farm-card/90 to-emerald-50/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900/90">
                  Choose your expert
                </p>
                <p className="text-[11px] text-slate-500">
                  Tap a profile picture to open their chat window.
                </p>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-emerald-900 shadow-sm">
                {EXPERTS.length} experts available today
              </span>
            </div>

            <div className="max-h-[360px] overflow-y-auto pt-1 pr-1">
              {EXPERTS.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  isActive={expert.id === selectedId}
                  onSelect={() => {
                    setSelectedId(expert.id)
                    setInfoOpen(false)
                  }}
                />
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-emerald-300/80 bg-emerald-50/70 px-3 py-2.5 text-[11px] text-emerald-900">
              <p className="font-semibold mb-0.5">How to get the best advice</p>
              <p>
                Before starting a chat, keep your last yield, irrigation schedule and
                fertiliser details handy. The more context you share, the sharper the
                guidance.
              </p>
            </div>
          </aside>

          <section className="h-full min-h-[340px]">
            <ChatWindow
              expert={selectedExpert}
              onInfoClick={() => setInfoOpen(true)}
            />
          </section>
        </section>
      </main>

      <InfoPanel
        expert={selectedExpert}
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
      />
    </div>
  )
}

export default App
