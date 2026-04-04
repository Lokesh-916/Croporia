import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../dashboard/hooks/useStore'
import { fmt, fmtK, fmtD, sum, daysFrom, lastNMonths, uid, today, isOverdue, calcEMI } from '../dashboard/utils/helpers'
import { CROP_COLORS, EXPENSE_CATEGORIES, CROPS, FIELD_CROPS, SOIL_TYPES, PAYMENT_METHODS, LOAN_SOURCES, LOAN_PURPOSES, TASK_CATEGORIES, PRIORITY_COLORS, CROP_STAGES, WEATHER_OPTIONS } from '../dashboard/data/constants'
import ChartBox from '../dashboard/components/ChartBox'
import Modal from '../dashboard/components/Modal'
import Navbar from '../components/Navbar'
import { LayoutDashboard, Wheat, TrendingUp, BookOpen, CreditCard, BarChart3, CheckSquare, Plus, X, Check, AlertTriangle, Bell, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'fields', label: 'Fields & Plots', Icon: Wheat },
  { id: 'yields', label: 'Yield Tracker', Icon: TrendingUp },
  { id: 'diary', label: 'Farm Diary', Icon: BookOpen },
  { id: 'expenses', label: 'Expenses', Icon: CreditCard },
  { id: 'loans', label: 'Loans', Icon: BarChart3 },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
]

const inp = "w-full border border-olive/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest bg-frosted/30 text-black-forest"
const sel = "w-full border border-olive/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest bg-frosted/30 text-black-forest"
const lbl = "block text-[11px] font-bold text-ash uppercase tracking-widest mb-1.5"

function MetricCard({ label, value, color = 'bg-frosted', textColor = 'text-black-forest' }) {
  return (
    <div className={`${color} rounded-2xl border border-olive/20 p-4`}>
      <p className={`text-2xl font-cinzel font-medium ${textColor} mb-1`}>{value}</p>
      <p className="text-[11px] font-semibold text-ash uppercase tracking-widest">{label}</p>
    </div>
  )
}

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="font-cinzel text-xl text-black-forest">{title}</h2>
        {sub && <p className="text-xs text-ash mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
// ── Dashboard Overview ──────────────────────────────────────────────────────
function DashboardPage({ store, onNav, regFields = [] }) {
  const { expenses, yields, loans, tasks } = store
  const totalRev = useMemo(() => sum(yields.data, y => y.revenue), [yields.data])
  const totalExp = useMemo(() => sum(expenses.data, e => e.amount), [expenses.data])
  const profit = totalRev - totalExp
  const loanBal = useMemo(() => sum(loans.data, l => l.principal - l.paid), [loans.data])
  const pending = tasks.data.filter(t => !t.done).length
  const months = lastNMonths(6)
  // Build real monthly expense/revenue arrays from actual data
  const expArr = useMemo(() => {
    const now = new Date()
    return Array.from({length: 6}, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return sum(expenses.data.filter(e => {
        const d = new Date(e.date); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()
      }), e => e.amount)
    })
  }, [expenses.data])
  const revArr = useMemo(() => {
    const now = new Date()
    return Array.from({length: 6}, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return sum(yields.data.filter(y => {
        const d = new Date(y.date); return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()
      }), y => y.revenue)
    })
  }, [yields.data])
  const barChart = { type: 'bar', data: { labels: months, datasets: [{ label: 'Expenses', data: expArr, backgroundColor: 'rgba(169,132,103,.7)', borderRadius: 5, borderSkipped: false }, { label: 'Revenue', data: revArr, backgroundColor: 'rgba(83,141,34,.7)', borderRadius: 5, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'Rs' + Math.round(v / 1000) + 'k', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,.04)' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } } } }
  const byCrop = yields.data.reduce((a, y) => { a[y.crop] = (a[y.crop] || 0) + Number(y.revenue); return a }, {})
  const cropKeys = Object.keys(byCrop)
  const cropChart = { type: 'doughnut', data: { labels: cropKeys, datasets: [{ data: cropKeys.map(c => byCrop[c]), backgroundColor: cropKeys.map(c => CROP_COLORS[c] || '#888'), borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 11 }, boxWidth: 10, padding: 8 } } } } }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <MetricCard label="Total Revenue" value={fmtK(totalRev)} color="bg-frosted" />
        <MetricCard label="Total Expenses" value={fmtK(totalExp)} color="bg-vanilla" textColor="text-copper" />
        <MetricCard label="Net Profit" value={fmtK(profit)} color={profit >= 0 ? 'bg-tea' : 'bg-red-50'} textColor={profit >= 0 ? 'text-forest' : 'text-red-600'} />
        <MetricCard label="Loan Balance" value={fmtK(loanBal)} color="bg-cream" />
        <MetricCard label="Pending Tasks" value={pending} color="bg-frosted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-olive/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-black-forest">Monthly Expenses vs Revenue</p>
            <div className="flex gap-3 text-[11px] text-ash">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-copper/70 inline-block" />Exp</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-forest/70 inline-block" />Rev</span>
            </div>
          </div>
          <ChartBox config={barChart} height="180px" />
        </div>
        <div className="bg-white rounded-2xl border border-olive/20 p-5">
          <p className="text-sm font-semibold text-black-forest mb-3">Revenue by Crop</p>
          {cropKeys.length > 0 ? <ChartBox config={cropChart} height="180px" /> : <div className="flex items-center justify-center h-[180px] text-ash text-sm">No yield data yet</div>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-black-forest">Active Fields</p>
            <button onClick={() => onNav('fields')} className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {regFields.slice(0, 4).map(f => {
              const crop = f.cropPlans?.[0]?.cropName || 'Fallow'
              const color = CROP_COLORS[crop] || '#538d22'
              return (
                <div key={f._id} className="bg-white rounded-xl border border-olive/20 p-3 overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
                  <p className="font-semibold text-sm text-black-forest mt-1">{f.name}</p>
                  <p className="text-[11px] text-ash">{f.area?.value} {f.area?.unit} · {f.soilDetails?.type || '—'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: color + '20', color }}>{crop}</span>
                    <span className="text-[11px] text-ash">{f.location || '—'}</span>
                  </div>
                </div>
              )
            })}
            {regFields.length === 0 && (
              <div className="col-span-2 bg-white rounded-xl border border-dashed border-olive/30 p-6 text-center text-ash text-sm">
                No fields yet. <a href="/fields/new" className="text-forest font-semibold underline">Register one →</a>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-black-forest">Recent Expenses</p>
            <button onClick={() => onNav('expenses')} className="text-xs text-forest font-semibold hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {expenses.data.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl border border-olive/20 px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: (CROP_COLORS[e.crop] || '#888') + '20', color: CROP_COLORS[e.crop] || '#888' }}>{e.cat[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black-forest truncate">{e.desc || e.cat}</p>
                  <p className="text-[11px] text-ash">{e.cat} · {e.crop}</p>
                </div>
                <span className="text-sm font-semibold text-copper shrink-0">-{fmt(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Fields Page ──────────────────────────────────────────────────────────────
function FieldsPage({ store, regFields = [] }) {
  const { expenses, yields } = store
  const [modal, setModal] = useState(false)

  const totalAcres = regFields.reduce((s, f) => s + (f.area?.value || 0), 0)

  return (
    <div className="space-y-5">
      <SectionHeader title="Fields & Plots" sub="Your registered fields from My Farm" action={
        <a href="/fields/new" className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" />Register Field
        </a>
      } />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total Fields" value={regFields.length} />
        <MetricCard label="Total Area" value={totalAcres.toFixed(1) + ' ac'} />
        <MetricCard label="Crops Growing" value={[...new Set(regFields.flatMap(f => f.cropPlans?.map(c => c.cropName)).filter(Boolean).filter(c => c !== 'Fallow' && c !== 'Nothing yet / Fallow'))].length} />
        <MetricCard label="Locations" value={[...new Set(regFields.map(f => f.location).filter(Boolean))].length} />
      </div>
      {regFields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-10 text-center text-ash">
          No fields registered yet. <a href="/fields/new" className="text-forest font-semibold underline ml-1">Register your first field →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regFields.map(f => {
            const crop = f.cropPlans?.[0]?.cropName || 'Fallow'
            const status = f.cropPlans?.[0]?.status || ''
            const color = CROP_COLORS[crop] || '#538d22'
            const fe = sum(expenses.data.filter(e => e.field === f.name), e => e.amount)
            const fr = sum(yields.data.filter(y => y.field === f.name), y => y.revenue)
            return (
              <div key={f._id} className="bg-white rounded-2xl border border-olive/20 overflow-hidden">
                <div className="h-1.5" style={{ background: color }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-cinzel font-medium text-black-forest">{f.name}</p>
                      <p className="text-[11px] text-ash">{f.area?.value} {f.area?.unit} · {f.soilDetails?.type || 'Unknown soil'} · {f.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: color + '20', color }}>{crop}</span>
                      <a href={`/fields/${f._id}/edit`} className="text-[11px] text-ash hover:text-forest font-medium">Edit</a>
                    </div>
                  </div>
                  {status && <p className="text-[11px] text-ash mb-3">Status: <span className="font-semibold text-forest">{status}</span></p>}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[['Expenses', fmt(fe), 'text-copper'], ['Revenue', fmt(fr), 'text-forest'], ['Profit', (fr-fe >= 0 ? '+' : '') + fmt(fr-fe), fr-fe >= 0 ? 'text-forest' : 'text-red-500']].map(([l, v, c]) => (
                      <div key={l} className="bg-frosted rounded-lg py-2"><p className={`text-xs font-bold ${c}`}>{v}</p><p className="text-[10px] text-ash">{l}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Loans Page ────────────────────────────────────────────────────────────────
function LoansPage({ store }) {
  const { loans, tasks } = store
  const [modal, setModal] = useState(false)
  const totalP = sum(loans.data, l => l.principal)
  const totalPaid = sum(loans.data, l => l.paid)
  const totalBal = totalP - totalPaid
  return (
    <div className="space-y-5">
      <SectionHeader title="Loan Tracker" sub="Monitor KCC, NABARD, and bank loans with repayment progress" action={<button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />Add Loan</button>} />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total Loans" value={fmtK(totalP)} />
        <MetricCard label="Total Paid" value={fmtK(totalPaid)} color="bg-tea" textColor="text-forest" />
        <MetricCard label="Outstanding" value={fmtK(totalBal)} color="bg-vanilla" textColor="text-copper" />
      </div>
      {loans.data.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-10 text-center text-ash">No loans tracked yet.</div>}
      <div className="space-y-4">
        {loans.data.map(l => {
          const bal = l.principal - l.paid
          const pct = Math.round(l.paid / l.principal * 100)
          const emi = calcEMI(l.principal, l.interest, l.months)
          return (
            <div key={l.id} className="bg-white rounded-2xl border border-olive/20 p-5">
              <div className="flex items-start justify-between mb-3">
                <div><p className="font-cinzel font-medium text-black-forest">{l.name}</p><p className="text-[11px] text-ash">{l.source} · {l.purpose}</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => tasks.add({ id: uid(), title: `EMI due — ${l.name}`, date: l.nextDue || today(), pri: 'High', cat: 'Loan EMI', done: false })} className="text-[11px] font-semibold text-forest border border-olive/30 px-2.5 py-1 rounded-full hover:bg-frosted flex items-center gap-1"><Bell className="w-3 h-3" />Remind</button>
                  <button onClick={() => loans.remove(l.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="w-full bg-olive/20 rounded-full h-2 mb-1"><div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? '#538d22' : pct >= 50 ? '#a98467' : '#c0392b' }} /></div>
              <div className="flex justify-between text-[10px] text-ash mb-3"><span>{pct}% repaid</span><span>Next due: {fmtD(l.nextDue)}</span></div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['Principal', fmt(l.principal), 'text-black-forest'], ['Paid', fmt(l.paid), 'text-forest'], ['Balance', fmt(bal), 'text-copper'], ['EMI', fmt(emi), 'text-ash']].map(([label, val, c]) => (
                  <div key={label} className="bg-frosted rounded-lg py-2"><p className={`text-xs font-bold ${c}`}>{val}</p><p className="text-[10px] text-ash">{label}</p></div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Loan" footer={<><button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { const p = Number(document.getElementById('lp').value); if (!p) { alert('Enter amount'); return } loans.add({ id: uid(), name: document.getElementById('ln').value || 'Loan', source: document.getElementById('ls').value, principal: p, interest: Number(document.getElementById('li').value) || 7, months: Number(document.getElementById('lm').value) || 12, start: document.getElementById('lst').value || today(), purpose: document.getElementById('lpu').value, paid: 0, nextDue: document.getElementById('lnd').value || '' }); setModal(false) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save Loan</button></>}>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Loan Name</label><input id="ln" className={inp} placeholder="e.g. Kisan Credit Card" /></div><div><label className={lbl}>Source</label><select id="ls" className={sel}>{LOAN_SOURCES.map(s => <option key={s}>{s}</option>)}</select></div></div>
        <div className="grid grid-cols-3 gap-3"><div><label className={lbl}>Principal (Rs)</label><input id="lp" type="number" className={inp} placeholder="0" /></div><div><label className={lbl}>Interest %</label><input id="li" type="number" className={inp} defaultValue="7" step="0.1" /></div><div><label className={lbl}>Tenure (months)</label><input id="lm" type="number" className={inp} defaultValue="12" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Start Date</label><input id="lst" type="date" className={inp} defaultValue={today()} /></div><div><label className={lbl}>Next Due Date</label><input id="lnd" type="date" className={inp} /></div></div>
        <div><label className={lbl}>Purpose</label><select id="lpu" className={sel}>{LOAN_PURPOSES.map(p => <option key={p}>{p}</option>)}</select></div>
      </Modal>
    </div>
  )
}

// ── Yields Page ───────────────────────────────────────────────────────────────
function YieldsPage({ store, regFields = [] }) {
  const { yields, fields } = store
  const [modal, setModal] = useState(false)
  const totalRev = sum(yields.data, y => y.revenue)
  const totalKg = sum(yields.data, y => y.kg)
  const byCrop = yields.data.reduce((a, y) => { a[y.crop] = (a[y.crop] || 0) + Number(y.revenue); return a }, {})
  const crops = Object.keys(byCrop)
  const chart = { type: 'bar', data: { labels: crops, datasets: [{ data: crops.map(c => byCrop[c]), backgroundColor: crops.map(c => CROP_COLORS[c] || '#888'), borderRadius: 8, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'Rs' + Math.round(v / 1000) + 'k', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,.04)' } }, x: { grid: { display: false } } } } }
  return (
    <div className="space-y-5">
      <SectionHeader title="Yield Tracker" sub="Record harvests, track sales and monitor crop revenue" action={<button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />Record Yield</button>} />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total Revenue" value={fmtK(totalRev)} color="bg-tea" textColor="text-forest" />
        <MetricCard label="Total Yield" value={totalKg.toLocaleString('en-IN') + ' kg'} />
        <MetricCard label="Harvest Records" value={yields.data.length} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {yields.data.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-10 text-center text-ash">No yields recorded yet.</div>}
          {yields.data.map(y => (
            <div key={y.id} className="flex items-center gap-3 bg-white rounded-xl border border-olive/20 px-4 py-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: (CROP_COLORS[y.crop] || '#888') + '20', color: CROP_COLORS[y.crop] || '#888' }}>{y.crop[0]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-black-forest">{y.crop} — {y.kg.toLocaleString()} kg @ {fmt(y.price)}/kg</p><p className="text-[11px] text-ash">{y.field || '—'} · {fmtD(y.date)} · {y.buyer || 'Market'}</p></div>
              <span className="text-sm font-semibold text-forest shrink-0">+{fmt(y.revenue)}</span>
              <button onClick={() => yields.remove(y.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-olive/20 p-5">
          <p className="text-sm font-semibold text-black-forest mb-3">Revenue by Crop</p>
          {crops.length > 0 ? <ChartBox config={chart} height="280px" /> : <div className="flex items-center justify-center h-[280px] text-ash text-sm">No data yet</div>}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Record Yield / Sale" footer={<><button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { const kg = Number(document.getElementById('y-kg').value), price = Number(document.getElementById('y-price').value); if (!kg || !price) { alert('Enter yield and price'); return } yields.add({ id: uid(), crop: document.getElementById('y-crop').value, field: document.getElementById('y-field').value, kg, price, revenue: kg * price, date: document.getElementById('y-date').value || today(), buyer: document.getElementById('y-buyer').value }); setModal(false) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save</button></>}>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Crop</label><select id="y-crop" className={sel}>{CROPS.map(c => <option key={c}>{c}</option>)}</select></div><div><label className={lbl}>Field</label><select id="y-field" className={sel}><option value="">— Select field —</option>{regFields.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}</select></div></div>
        <div className="grid grid-cols-3 gap-3"><div><label className={lbl}>Yield (kg)</label><input id="y-kg" type="number" className={inp} placeholder="0" /></div><div><label className={lbl}>Price (Rs/kg)</label><input id="y-price" type="number" className={inp} placeholder="0" /></div><div><label className={lbl}>Date</label><input id="y-date" type="date" className={inp} defaultValue={today()} /></div></div>
        <div><label className={lbl}>Sold To</label><input id="y-buyer" className={inp} placeholder="e.g. APMC Vijayawada" /></div>
      </Modal>
    </div>
  )
}

// ── Diary Page ────────────────────────────────────────────────────────────────
function DiaryPage({ store, regFields = [] }) {
  const { diary, tasks } = store
  const [modal, setModal] = useState(null)
  const [dv, setDv] = useState({ date: today(), weather: 'Sunny', crop: 'Rice', stage: 'Vegetative', work: '', prob: '' })
  const [tv, setTv] = useState({ title: '', date: today(), pri: 'Medium', cat: 'Fertilizer' })
  return (
    <div className="space-y-5">
      <SectionHeader title="Farm Diary & Reminders" sub="Daily activity log alongside your task list" action={<div className="flex gap-2"><button onClick={() => setModal('task')} className="flex items-center gap-1.5 px-4 py-2 border border-olive/40 text-ash text-sm font-semibold rounded-xl hover:bg-frosted transition-colors"><Bell className="w-4 h-4" />Add Reminder</button><button onClick={() => setModal('diary')} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />New Entry</button></div>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          <p className="text-sm font-semibold text-black-forest mb-2">Daily Log</p>
          {diary.data.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-8 text-center text-ash">No diary entries yet.</div>}
          {diary.data.map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-olive/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-ash uppercase tracking-wide">{fmtD(d.date)}</span>
                  <span className="text-[10px] bg-frosted text-ash px-2 py-0.5 rounded-full border border-olive/20">{d.weather}</span>
                  <span className="text-[10px] bg-vanilla text-copper px-2 py-0.5 rounded-full border border-cream">{d.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-tea text-forest px-2 py-0.5 rounded-full border border-olive/20">{d.crop}</span>
                  <button onClick={() => diary.remove(d.id)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="text-xs text-ash font-bold uppercase tracking-wide mb-1">Work Done</p>
              <p className="text-sm text-black-forest leading-relaxed">{d.work}</p>
              {d.prob && <div className="mt-2 flex items-start gap-1.5 text-xs text-copper bg-vanilla rounded-lg px-3 py-2 border border-cream"><AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{d.prob}</div>}
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-black-forest mb-2">Upcoming Tasks</p>
          <div className="space-y-2">
            {tasks.data.filter(t => !t.done).slice(0, 8).map(t => (
              <div key={t.id} className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 ${isOverdue(t.date) ? 'border-red-200' : 'border-olive/20'}`}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[t.pri] }} />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-black-forest truncate">{t.title}</p><p className="text-[11px] text-ash">{fmtD(t.date)}</p></div>
                <button onClick={() => tasks.update(t.id, { done: true })} className="w-6 h-6 flex items-center justify-center rounded-full border border-olive/30 hover:bg-frosted text-forest transition-colors"><Check className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal open={modal === 'diary'} onClose={() => setModal(null)} title="New Diary Entry" footer={<><button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { diary.add({ id: uid(), ...dv, work: dv.work || 'No details.' }); setDv({ date: today(), weather: 'Sunny', crop: 'Rice', stage: 'Vegetative', work: '', prob: '' }); setModal(null) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save Entry</button></>}>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Date</label><input type="date" value={dv.date} onChange={e => setDv(p => ({ ...p, date: e.target.value }))} className={inp} /></div><div><label className={lbl}>Weather</label><select value={dv.weather} onChange={e => setDv(p => ({ ...p, weather: e.target.value }))} className={sel}>{WEATHER_OPTIONS.map(w => <option key={w}>{w}</option>)}</select></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Crop</label><select value={dv.crop} onChange={e => setDv(p => ({ ...p, crop: e.target.value }))} className={sel}>{[...CROPS, 'All Fields'].map(c => <option key={c}>{c}</option>)}</select></div><div><label className={lbl}>Stage</label><select value={dv.stage} onChange={e => setDv(p => ({ ...p, stage: e.target.value }))} className={sel}>{CROP_STAGES.map(s => <option key={s}>{s}</option>)}</select></div></div>
        <div><label className={lbl}>Work Done</label><textarea value={dv.work} onChange={e => setDv(p => ({ ...p, work: e.target.value }))} className={inp + ' resize-none'} rows={3} placeholder="What farming activities did you do today?" /></div>
        <div><label className={lbl}>Problems / Observations</label><textarea value={dv.prob} onChange={e => setDv(p => ({ ...p, prob: e.target.value }))} className={inp + ' resize-none'} rows={2} placeholder="Any pests, disease, water issues..." /></div>
      </Modal>
      <Modal open={modal === 'task'} onClose={() => setModal(null)} title="Add Task / Reminder" footer={<><button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { if (!tv.title.trim()) { alert('Enter task name'); return } tasks.add({ id: uid(), ...tv, done: false }); setTv({ title: '', date: today(), pri: 'Medium', cat: 'Fertilizer' }); setModal(null) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save Task</button></>}>
        <div><label className={lbl}>Task Description</label><input value={tv.title} onChange={e => setTv(p => ({ ...p, title: e.target.value }))} className={inp} placeholder="e.g. Apply fertilizer — Rice field" /></div>
        <div className="grid grid-cols-3 gap-3"><div><label className={lbl}>Due Date</label><input type="date" value={tv.date} onChange={e => setTv(p => ({ ...p, date: e.target.value }))} className={inp} /></div><div><label className={lbl}>Priority</label><select value={tv.pri} onChange={e => setTv(p => ({ ...p, pri: e.target.value }))} className={sel}>{['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}</select></div><div><label className={lbl}>Category</label><select value={tv.cat} onChange={e => setTv(p => ({ ...p, cat: e.target.value }))} className={sel}>{TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div></div>
      </Modal>
    </div>
  )
}

// ── Expenses Page ─────────────────────────────────────────────────────────────
function ExpensesPage({ store, regFields = [] }) {
  const { expenses, fields } = store
  const [modal, setModal] = useState(false)
  const total = sum(expenses.data, e => e.amount)
  const byCat = expenses.data.reduce((a, e) => { a[e.cat] = (a[e.cat] || 0) + Number(e.amount); return a }, {})
  const cats = Object.keys(byCat)
  const catChart = { type: 'doughnut', data: { labels: cats, datasets: [{ data: cats.map(c => byCat[c]), backgroundColor: ['#538d22','#a98467','#c0392b','#718355','#97a97c','#245501','#73a942','#6c584c'], borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 10 } } } } }
  return (
    <div className="space-y-5">
      <SectionHeader title="Expenses" sub="Track all farm expenditures by category, crop, and field" action={<button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />Add Expense</button>} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total Spent" value={fmtK(total)} color="bg-vanilla" textColor="text-copper" />
        <MetricCard label="Transactions" value={expenses.data.length} />
        <MetricCard label="Top Category" value={cats.sort((a, b) => byCat[b] - byCat[a])[0] || '—'} />
        <MetricCard label="This Month" value={fmtK(sum(expenses.data.filter(e => new Date(e.date) >= new Date(new Date().setDate(1))), e => e.amount))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {expenses.data.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-10 text-center text-ash">No expenses yet.</div>}
          {expenses.data.map(e => (
            <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl border border-olive/20 px-4 py-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: (CROP_COLORS[e.crop] || '#888') + '20', color: CROP_COLORS[e.crop] || '#888' }}>{e.cat[0]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-black-forest truncate">{e.desc || e.cat}</p><p className="text-[11px] text-ash">{e.cat} · {e.crop} · {fmtD(e.date)} · {e.pay}</p></div>
              <span className="text-sm font-semibold text-copper shrink-0">-{fmt(e.amount)}</span>
              <button onClick={() => expenses.remove(e.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-olive/20 p-5">
          <p className="text-sm font-semibold text-black-forest mb-3">Spending by Category</p>
          {cats.length > 0 ? <ChartBox config={catChart} height="280px" /> : <div className="flex items-center justify-center h-[280px] text-ash text-sm">No data yet</div>}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Expense" footer={<><button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { const amt = Number(document.getElementById('ea').value); if (!amt) { alert('Enter amount'); return } expenses.add({ id: uid(), date: document.getElementById('ed').value || today(), amount: amt, cat: document.getElementById('ec').value, crop: document.getElementById('ecrop').value, field: document.getElementById('ef').value, pay: document.getElementById('ep').value, desc: document.getElementById('edesc').value }); setModal(false) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save</button></>}>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Date</label><input id="ed" type="date" className={inp} defaultValue={today()} /></div><div><label className={lbl}>Amount (Rs)</label><input id="ea" type="number" className={inp} placeholder="0" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Category</label><select id="ec" className={sel}>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><div><label className={lbl}>Crop</label><select id="ecrop" className={sel}>{CROPS.map(c => <option key={c}>{c}</option>)}</select></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Field</label><select id="ef" className={sel}><option value="">— Select field —</option>{regFields.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}</select></div><div><label className={lbl}>Payment</label><select id="ep" className={sel}>{PAYMENT_METHODS.map(p => <option key={p}>{p}</option>)}</select></div></div>
        <div><label className={lbl}>Description</label><input id="edesc" className={inp} placeholder="e.g. DAP fertilizer 50kg" /></div>
      </Modal>
    </div>
  )
}

// ── Tasks Page ────────────────────────────────────────────────────────────────
function TasksPage({ store }) {
  const { tasks } = store
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', date: today(), pri: 'Medium', cat: 'Fertilizer' })
  const pending = tasks.data.filter(t => !t.done)
  const done = tasks.data.filter(t => t.done)
  const overdue = pending.filter(t => isOverdue(t.date))
  const upcoming = pending.filter(t => !isOverdue(t.date)).sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.pri] - { High: 0, Medium: 1, Low: 2 }[b.pri]))
  return (
    <div className="space-y-5">
      <SectionHeader title="Tasks & Reminders" sub="Stay on top of farm activities, deadlines and scheduled tasks" action={<button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />Add Task</button>} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Overdue" value={overdue.length} color={overdue.length > 0 ? 'bg-red-50' : 'bg-frosted'} textColor={overdue.length > 0 ? 'text-red-600' : 'text-black-forest'} />
        <MetricCard label="Pending" value={pending.length} color="bg-vanilla" />
        <MetricCard label="High Priority" value={pending.filter(t => t.pri === 'High').length} color="bg-cream" />
        <MetricCard label="Completed" value={done.length} color="bg-frosted" textColor="text-forest" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          {overdue.length > 0 && <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-700 font-semibold"><AlertTriangle className="w-4 h-4" />{overdue.length} overdue task{overdue.length > 1 ? 's' : ''}</div>}
          {[...overdue, ...upcoming].map(t => (
            <div key={t.id} className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 ${isOverdue(t.date) ? 'border-red-200' : 'border-olive/20'}`}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[t.pri] }} />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-black-forest truncate">{t.title}</p><p className="text-[11px] text-ash">{t.cat} · Due {fmtD(t.date)} · <span style={{ color: PRIORITY_COLORS[t.pri] }}>{t.pri}</span></p></div>
              <button onClick={() => tasks.update(t.id, { done: true })} className="flex items-center gap-1 text-[11px] font-semibold text-forest border border-olive/30 px-2.5 py-1 rounded-full hover:bg-frosted transition-colors"><Check className="w-3 h-3" />Done</button>
              <button onClick={() => tasks.remove(t.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {pending.length === 0 && <div className="bg-frosted rounded-xl border border-olive/20 p-6 text-center text-ash text-sm">All tasks completed!</div>}
        </div>
        <div>
          <p className="text-sm font-semibold text-black-forest mb-3">Completed ({done.length})</p>
          <div className="space-y-2 opacity-60">
            {done.map(t => (
              <div key={t.id} className="flex items-center gap-3 bg-white rounded-xl border border-olive/20 px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ash/40 shrink-0" />
                <p className="text-sm text-ash line-through flex-1 truncate">{t.title}</p>
                <button onClick={() => tasks.remove(t.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Task / Reminder" footer={<><button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { if (!form.title.trim()) { alert('Enter task name'); return } tasks.add({ id: uid(), ...form, done: false }); setForm({ title: '', date: today(), pri: 'Medium', cat: 'Fertilizer' }); setModal(false) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save Task</button></>}>
        <div><label className={lbl}>Task Description</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} placeholder="e.g. Apply fertilizer — Rice field" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={lbl}>Due Date</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inp} /></div>
          <div><label className={lbl}>Priority</label><select value={form.pri} onChange={e => setForm(p => ({ ...p, pri: e.target.value }))} className={sel}>{['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}</select></div>
          <div><label className={lbl}>Category</label><select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} className={sel}>{TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
      </Modal>
    </div>
  )
}

// ── Main UserDashboard wrapper ────────────────────────────────────────────────
const PAGES = { dashboard: DashboardPage, fields: FieldsPage, yields: YieldsPage, diary: DiaryPage, expenses: ExpensesPage, loans: LoansPage, tasks: TasksPage }

export default function UserDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')
  const store = useStore()
  const [page, setPage] = useState('dashboard')
  const [regFields, setRegFields] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('croporia_token')
    if (!token) return
    fetch('http://localhost:5000/api/fields', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { if (Array.isArray(data)) setRegFields(data) }).catch(() => {})
  }, [])

  const pendingTasks = useMemo(() => store.tasks.data.filter(t => !t.done).length, [store.tasks.data])
  const overdueCount = useMemo(() => store.tasks.data.filter(t => !t.done && isOverdue(t.date)).length, [store.tasks.data])
  const PageComponent = PAGES[page] || DashboardPage

  if (!user) { navigate('/login'); return null }

  if (!store.loaded) return (
    <div className="min-h-screen bg-vanilla flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-olive/20 border-t-forest rounded-full animate-spin mx-auto mb-3" />
        <p className="text-ash text-sm font-medium">Loading your farm data...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-olive/20 min-h-[calc(100vh-56px)] sticky top-14 pt-4 pb-8 px-3">
          {overdueCount > 0 && (
            <button onClick={() => setPage('tasks')} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-700 font-semibold mb-3 w-full">
              <AlertTriangle className="w-3.5 h-3.5" />{overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
            </button>
          )}
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setPage(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${page === id ? 'bg-frosted text-black-forest border border-olive/20' : 'text-ash hover:bg-frosted/50 hover:text-black-forest'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {id === 'tasks' && pendingTasks > 0 && <span className="ml-auto text-[10px] font-bold bg-forest text-white px-1.5 py-0.5 rounded-full">{pendingTasks}</span>}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-olive/20">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ash hover:text-forest transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to Croporia
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-6 pb-16 max-w-5xl">
          <PageComponent store={store} onNav={setPage} regFields={regFields} />
        </main>
      </div>
    </div>
  )
}
