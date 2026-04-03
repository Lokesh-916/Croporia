import { useState, useEffect } from 'react'
import { MessageSquare, Users, Star, Award, Send, X } from 'lucide-react'
import Navbar from '../components/Navbar'

// Simulated messages received by the expert
const MOCK_MESSAGES = [
  { id: 1, from: 'Ramesh Kumar', time: '2 hours ago', preview: 'My wheat crop is yellowing in patches. What should I check first?', read: false },
  { id: 2, from: 'Priya Sharma', time: '5 hours ago', preview: 'I have 3 acres of black soil in Vidarbha. Which cotton variety should I plant this kharif?', read: false },
  { id: 3, from: 'Suresh Patil', time: '1 day ago', preview: 'My mango trees are not flowering this season despite being 6 years old. Any advice?', read: true },
  { id: 4, from: 'Kavitha Reddy', time: '2 days ago', preview: 'Leaf curl on chilli plants. Tried copper spray but spreading. Natural remedies?', read: true },
]

const PEER_EXPERTS = [
  { name: 'Dr. Santosh Verma', specialization: 'Soil & Nutrient Management', region: 'Punjab', status: 'online' },
  { name: 'Anita Kulkarni', specialization: 'Fruit Orchard Specialist', region: 'Maharashtra', status: 'away' },
  { name: 'Rahul Menon', specialization: 'Climate-Smart Farming', region: 'Karnataka', status: 'offline' },
]

export default function ExpertDashboard() {
  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [activeMsg, setActiveMsg] = useState(null)
  const [reply, setReply] = useState('')
  const [replySent, setReplySent] = useState(false)

  const unread = messages.filter(m => !m.read).length

  const openMessage = (msg) => {
    setActiveMsg(msg)
    setReplySent(false)
    setReply('')
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
  }

  const sendReply = () => {
    if (!reply.trim()) return
    setReplySent(true)
  }

  return (
    <div className="min-h-screen bg-vanilla font-sans text-black-forest">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <header className="mb-8">
          <p className="text-[11px] font-bold text-copper uppercase tracking-[0.22em] mb-2">Expert Portal</p>
          <h1 className="font-cinzel text-4xl font-black text-black-forest mb-1">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-ash">Your expert dashboard — manage messages, connect with peers, and track your impact.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Unread Messages', value: unread, icon: MessageSquare, color: 'bg-frosted border-olive/30 text-forest' },
            { label: 'Farmers Helped', value: '47', icon: Users, color: 'bg-tea border-olive/30 text-black-forest' },
            { label: 'Your Rating', value: `${user?.expertDetails?.rating || 5.0}`, icon: Star, color: 'bg-vanilla border-cream text-copper' },
            { label: 'Achievements', value: `${user?.expertDetails?.achievements?.length || 3}`, icon: Award, color: 'bg-cream border-cream text-ash' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border p-4 ${color}`}>
              <Icon className="w-5 h-5 mb-2 opacity-70" />
              <p className="text-2xl font-black font-cinzel">{value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide mt-0.5 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Messages Inbox */}
          <div className="bg-white rounded-3xl border border-olive/30 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-olive/20 flex items-center justify-between">
              <h2 className="font-cinzel font-bold text-black-forest">Messages from Farmers</h2>
              {unread > 0 && <span className="text-[11px] font-bold bg-forest text-white px-2.5 py-1 rounded-full">{unread} new</span>}
            </div>
            <div className="divide-y divide-olive/10">
              {messages.map(msg => (
                <button key={msg.id} onClick={() => openMessage(msg)}
                  className={`w-full text-left px-6 py-4 hover:bg-frosted/50 transition-colors ${!msg.read ? 'bg-frosted/30' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-tea border border-olive/30 flex items-center justify-center text-sm font-bold text-forest shrink-0">
                        {msg.from[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-black-forest">{msg.from}</p>
                          {!msg.read && <span className="w-2 h-2 rounded-full bg-forest shrink-0" />}
                        </div>
                        <p className="text-xs text-ash truncate max-w-[220px]">{msg.preview}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-ash shrink-0">{msg.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Peer Experts */}
          <div className="bg-white rounded-3xl border border-olive/30 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-olive/20">
              <h2 className="font-cinzel font-bold text-black-forest">Fellow Experts</h2>
              <p className="text-xs text-ash mt-0.5">Connect and collaborate with other specialists</p>
            </div>
            <div className="divide-y divide-olive/10">
              {PEER_EXPERTS.map(expert => (
                <div key={expert.name} className="px-6 py-4 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-frosted border border-olive/30 flex items-center justify-center text-sm font-bold text-forest">
                      {expert.name[0]}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${expert.status === 'online' ? 'bg-forest' : expert.status === 'away' ? 'bg-copper' : 'bg-ash/40'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black-forest truncate">{expert.name}</p>
                    <p className="text-[11px] text-ash truncate">{expert.specialization}</p>
                  </div>
                  <span className="text-[10px] text-ash">{expert.region}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-olive/10">
              <p className="text-xs text-ash text-center">Real-time expert chat coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {activeMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-olive/30 shadow-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tea border border-olive/30 flex items-center justify-center text-sm font-bold text-forest">{activeMsg.from[0]}</div>
                <div>
                  <p className="font-cinzel font-bold text-black-forest">{activeMsg.from}</p>
                  <p className="text-xs text-ash">{activeMsg.time}</p>
                </div>
              </div>
              <button onClick={() => setActiveMsg(null)} className="w-8 h-8 flex items-center justify-center rounded-full border border-olive/40 text-ash hover:bg-frosted"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-frosted rounded-2xl p-4 mb-4 border border-olive/20">
              <p className="text-sm text-black-forest leading-relaxed">{activeMsg.preview}</p>
            </div>
            {replySent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-frosted rounded-full flex items-center justify-center mx-auto mb-3"><Send className="w-5 h-5 text-forest" /></div>
                <p className="font-cinzel font-bold text-black-forest mb-1">Reply Sent</p>
                <p className="text-sm text-ash">Your response has been delivered to {activeMsg.from}.</p>
                <button onClick={() => setActiveMsg(null)} className="mt-4 px-6 py-2 bg-black-forest text-white rounded-full text-sm font-semibold hover:bg-forest transition-colors">Close</button>
              </div>
            ) : (
              <>
                <textarea rows={4} placeholder={`Reply to ${activeMsg.from}...`}
                  className="w-full bg-frosted/50 px-4 py-3 rounded-xl text-sm text-black-forest border border-olive/40 outline-none resize-none focus:border-forest mb-4"
                  value={reply} onChange={e => setReply(e.target.value)} />
                <button onClick={sendReply} className="w-full bg-black-forest hover:bg-forest text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Send className="w-4 h-4" /> Send Reply
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
