import { useState, useMemo } from 'react'
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
function DashboardPage({ store, onNav }) {
  const { fields, expenses, yields, loans, tasks } = store
  const totalRev = useMemo(() => sum(yields.data, y => y.revenue), [yields.data])
  const totalExp = useMemo(() => sum(expenses.data, e => e.amount), [expenses.data])
  const profit = totalRev - totalExp
  const loanBal = useMemo(() => sum(loans.data, l => l.principal - l.paid), [loans.data])
  const pending = tasks.data.filter(t => !t.done).length
  const months = lastNMonths(6)
  const expArr = [18000, 22000, 15000, 28000, 19000, sum(expenses.data, e => e.amount) || 12000]
  const revArr = [25000, 30000, 20000, 45000, 28000, totalRev || 0]
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
            {fields.data.slice(0, 4).map(f => {
              const dh = daysFrom(f.harv)
              return (
                <div key={f.id} className="bg-white rounded-xl border border-olive/20 p-3 overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: f.color }} />
                  <p className="font-semibold text-sm text-black-forest mt-1">{f.name}</p>
                  <p className="text-[11px] text-ash">{f.acres} ac · {f.soil}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: f.color + '20', color: f.color }}>{f.crop}</span>
                    <span className="text-[11px] text-ash">{dh != null ? (dh > 0 ? dh + 'd' : 'Due!') : '—'}</span>
                  </div>
                </div>
              )
            })}
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
function FieldsPage({ store }) {
  const { fields, expenses, yields } = store
  const [modal, setModal] = useState(false)
  const totalAcres = fields.data.reduce((s, f) => s + Number(f.acres), 0)
  return (
    <div className="space-y-5">
      <SectionHeader title="Fields & Plots" sub="Track each field performance, crop status and harvest schedule" action={<button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black-forest hover:bg-forest text-white text-sm font-semibold rounded-xl transition-colors"><Plus className="w-4 h-4" />Add Field</button>} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total Fields" value={fields.data.length} />
        <MetricCard label="Total Acres" value={totalAcres.toFixed(1)} />
        <MetricCard label="Crops Growing" value={[...new Set(fields.data.map(f => f.crop).filter(c => c !== 'Fallow'))].length} />
        <MetricCard label="Harvest Soon" value={fields.data.filter(f => { const d = daysFrom(f.harv); return d != null && d <= 21 && d >= 0 }).length} color="bg-vanilla" />
      </div>
      {fields.data.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-olive/40 p-10 text-center text-ash">No fields yet. Add your first field to get started.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.data.map(f => {
          const fe = sum(expenses.data.filter(e => e.field === f.name), e => e.amount)
          const fr = sum(yields.data.filter(y => y.field === f.name), y => y.revenue)
          const fp = fr - fe; const dh = daysFrom(f.harv)
          return (
            <div key={f.id} className="bg-white rounded-2xl border border-olive/20 overflow-hidden">
              <div className="h-1.5" style={{ background: f.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-cinzel font-medium text-black-forest">{f.name}</p><p className="text-[11px] text-ash">{f.acres} acres · {f.soil} · Sown {fmtD(f.sow)}</p></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: f.color + '20', color: f.color }}>{f.crop}</span>
                    <button onClick={() => fields.remove(f.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-ash hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                </div>
                {f.notes && <p className="text-[11px] text-ash italic mb-3">{f.notes}</p>}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[['Expenses', fmt(fe), 'text-copper'], ['Revenue', fmt(fr), 'text-forest'], ['Profit', (fp >= 0 ? '+' : '') + fmt(fp), fp >= 0 ? 'text-forest' : 'text-red-500'], ['Harvest', dh != null ? (dh > 0 ? dh + 'd' : 'Due!') : '—', dh != null && dh <= 14 ? 'text-copper' : 'text-black-forest']].map(([l, v, c]) => (
                    <div key={l} className="bg-frosted rounded-lg py-2"><p className={`text-xs font-bold ${c}`}>{v}</p><p className="text-[10px] text-ash">{l}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Field / Plot" footer={<><button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-olive/40 text-ash text-sm font-semibold hover:bg-frosted">Cancel</button><button onClick={() => { const name = document.getElementById('f-name').value.trim(); if (!name) { alert('Enter field name'); return } fields.add({ id: uid(), name, acres: Number(document.getElementById('f-acres').value) || 1, crop: document.getElementById('f-crop').value, soil: document.getElementById('f-soil').value, sow: document.getElementById('f-sow').value || today(), harv: document.getElementById('f-harv').value || today(), notes: document.getElementById('f-notes').value, color: CROP_COLORS[document.getElementById('f-crop').value] || '#538d22' }); setModal(false) }} className="px-4 py-2 rounded-xl bg-black-forest hover:bg-forest text-white text-sm font-semibold">Save Field</button></>}>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Field Name</label><input id="f-name" className={inp} placeholder="e.g. North Field" /></div><div><label className={lbl}>Area (Acres)</label><input id="f-acres" type="number" className={inp} placeholder="0.0" step="0.1" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Current Crop</label><select id="f-crop" className={sel}>{FIELD_CROPS.map(c => <option key={c}>{c}</option>)}</select></div><div><label className={lbl}>Soil Type</label><select id="f-soil" className={sel}>{SOIL_TYPES.map(s => <option key={s}>{s}</option>)}</select></div></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Sowing Date</label><input id="f-sow" type="date" className={inp} defaultValue={today()} /></div><div><label className={lbl}>Expected Harvest</label><input id="f-harv" type="date" className={inp} /></div></div>
        <div><label className={lbl}>Notes</label><textarea id="f-notes" className={inp + ' resize-none'} rows={2} placeholder="Any notes about this field..." /></div>
      </Modal>
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
function YieldsPage({ store }) {
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
        <div className="grid grid-cols-2 gap-3"><div><label className={lbl}>Crop</label><select id="y-crop" className={sel}>{CROPS.map(c => <option key={c}>{c}</option>)}</select></div><div><label className={lbl}>Field</label><select id="y-field" className={sel}>{fields.data.map(f => <option key={f.id}>{f.name}</option>)}</select></div></div>
        <div className="grid grid-cols-3 gap-3"><div><label className={lbl}>Yield (kg)</label><input id="y-kg" type="number" className={inp} placeholder="0" /></div><div><label className={lbl}>Price (Rs/kg)</label><input id="y-price" type="number" className={inp} placeholder="0" /></div><div><label className={lbl}>Date</label><input id="y-date" type="date" className={inp} defaultValue={today()} /></div></div>
        <div><label className={lbl}>Sold To</label><input id="y-buyer" className={inp} placeholder="e.g. APMC Vijayawada" /></div>
      </Modal>
    </div>
  )
}

// ── Diary Page ────────────────────────────────────────────────────────────────
function DiaryPage({ store }) {
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

// ── Main UserDashboard wrapper ────────────────────────────────────────────────
const PAGES = { dashboard: DashboardPage, fields: FieldsPage, yields: YieldsPage, diary: DiaryPage, expenses: ExpensesPage, loans: LoansPage, tasks: TasksPage }

export default function UserDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')
  const store = useStore()
  const [page, setPage] = useState('dashboard')
  const pendingTasks = useMemo(() => store.tasks.data.filter(t => !t.done).length, [store.tasks.data])
  const overdueCount = useMemo(() => store.tasks.data.filter(t => !t.done && isOverdue(t.date)).length, [store.tasks.data])
  const PageComponent = PAGES[page] || DashboardPage

  if (!user) { navigate('/login'); return null }

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
          <PageComponent store={store} onNav={setPage} />
        </main>
      </div>
    </div>
  )
}
