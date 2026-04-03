import { useState, useEffect } from 'react'
import { Globe, MapPin, Bookmark, HelpCircle, ThumbsUp, MessageSquare, Camera, Leaf } from 'lucide-react'
import Navbar from '../../components/Navbar'

const TOP_CONTRIBUTORS = [
  { name: 'Ramesh Kumar', title: 'Master Farmer - Punjab', quote: 'Tip: Always test pH before applying urea.' },
  { name: 'Anita Devi', title: 'Organic Specialist - Kerala', quote: 'Neem oil works best when sprayed at dawn.' },
  { name: 'Venkat K.', title: 'Agri Tech Expert - AP', quote: 'Groundnut yields up 20% using raised beds.' },
  { name: 'Prakash Singh', title: 'Veteran Grower - MP', quote: 'Do not overwater seedlings in black soil.' },
]

export default function CommunityIndex() {
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/community/posts')
      .then(r => r.json()).then(data => { if (Array.isArray(data)) setPosts(data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handlePost = async () => {
    if (!newPost.trim()) return
    const token = localStorage.getItem('croporia_token')
    if (!token) { setError('Please login to post.'); return }
    try {
      const res = await fetch('http://localhost:5000/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: newPost, cropTag: 'Discussion' }) })
      if (res.ok) { const saved = await res.json(); setPosts([saved, ...posts]); setNewPost(''); setError(null) }
      else { const e = await res.json(); setError(e.error || 'Failed to post.') }
    } catch { setError('Cannot connect to server.') }
  }

  const handleLike = async (postId) => {
    const token = localStorage.getItem('croporia_token')
    if (!token) { setError('Please login to interact.'); return }
    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${postId}/like`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) { const updated = await res.json(); setPosts(posts.map(p => p._id === postId ? updated : p)) }
    } catch {}
  }

  const formatTime = (d) => {
    const diff = Math.floor((new Date() - new Date(d)) / 3600000)
    if (diff < 1) return 'Just now'; if (diff < 24) return `${diff}h ago`; return `${Math.floor(diff/24)}d ago`
  }

  return (
    <div className="bg-vanilla min-h-screen font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-2">
            {[{icon:<Globe className="w-4 h-4"/>,label:'Global Feed',active:true},{icon:<MapPin className="w-4 h-4"/>,label:'Local Growers',active:false},{icon:<Bookmark className="w-4 h-4"/>,label:'My Saved Posts',active:false},{icon:<HelpCircle className="w-4 h-4"/>,label:'Ask an Expert',active:false}].map(nav => (
              <button key={nav.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${nav.active ? 'bg-black-forest text-white shadow-sm' : 'text-ash hover:bg-white hover:shadow-sm'}`}>{nav.icon}{nav.label}</button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-olive/30 flex flex-col gap-4">
            <textarea rows="3" className="w-full resize-none text-black-forest bg-frosted/50 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-forest/20 border border-transparent focus:border-forest/30 transition-all placeholder:text-ash/50" placeholder="Ask a question, share an update, or upload a harvest photo..." value={newPost} onChange={e => setNewPost(e.target.value)} />
            {error && <p className="text-red-500 text-xs px-2 font-bold">{error}</p>}
            <div className="flex justify-between items-center px-1">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full hover:bg-frosted flex items-center justify-center transition-colors border border-olive/20"><Camera className="w-4 h-4 text-ash" /></button>
                <button className="w-10 h-10 rounded-full hover:bg-frosted flex items-center justify-center transition-colors border border-olive/20"><Leaf className="w-4 h-4 text-forest" /></button>
              </div>
              <button onClick={handlePost} className="px-6 py-2.5 bg-black-forest hover:bg-forest text-white text-sm font-bold rounded-xl transition-colors">Post to Community</button>
            </div>
          </div>
          <div className="flex items-center gap-4 py-2 border-b border-olive/20">
            <button className="text-sm font-black text-black-forest border-b-2 border-forest pb-2">Recent</button>
            <button className="text-sm font-bold text-ash pb-2 hover:text-black-forest">Top Rated</button>
            <button className="text-sm font-bold text-ash pb-2 hover:text-black-forest">Unanswered</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-olive/20 border-t-forest rounded-full animate-spin" /></div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-olive/20 shadow-sm text-ash font-bold">No posts yet. Be the first to start a discussion!</div>
          ) : posts.map(post => (
            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-olive/20 transition-all hover:shadow-md">
              <div className="flex w-full justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-frosted flex items-center justify-center text-forest font-black border border-olive/30">{post.authorName?.[0] || '?'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-black-forest">{post.authorName}</p>
                      {post.authorRole === 'Expert' && <span className="text-[10px] bg-vanilla text-copper px-2 py-0.5 rounded-full font-bold border border-cream">Expert</span>}
                    </div>
                    <p className="text-[11px] font-bold text-ash">{formatTime(post.createdAt)}</p>
                  </div>
                </div>
                {post.cropTag && post.cropTag !== 'Discussion' && <span className="text-[10px] font-bold px-3 py-1 bg-frosted text-forest border border-olive/30 rounded-full">{post.cropTag}</span>}
              </div>
              <p className="text-[15px] text-ash leading-relaxed mb-4">{post.content}</p>
              <div className="flex gap-6 border-t border-olive/10 pt-3">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 text-xs font-bold text-ash hover:text-forest transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Like ({post.likes?.length || 0})</button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-ash hover:text-forest transition-colors"><MessageSquare className="w-3.5 h-3.5" /> Reply</button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="bg-white rounded-2xl border border-olive/20 p-6 shadow-sm">
            <h3 className="text-sm font-black text-black-forest mb-4 uppercase tracking-wider">Top Contributors</h3>
            <div className="space-y-4">
              {TOP_CONTRIBUTORS.map(c => (
                <div key={c.name} className="border-b border-olive/10 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-black-forest">{c.name}</p>
                  <p className="text-[11px] text-ash">{c.title}</p>
                  <p className="text-xs text-forest mt-1 italic">"{c.quote}"</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-olive/20 shadow-sm">
            <h3 className="text-sm font-black text-black-forest mb-4 uppercase tracking-wider">Trending Topics</h3>
            <div className="space-y-4">
              {[{label:'#MonsoonPrep2026',posts:'1.2k'},{label:'#OrganicPesticides',posts:'850'},{label:'#TomatoBlight',posts:'430'},{label:'#GovtSubsidies',posts:'210'}].map(tag => (
                <div key={tag.label} className="group cursor-pointer">
                  <p className="text-sm font-bold text-black-forest group-hover:text-forest transition-colors">{tag.label}</p>
                  <p className="text-[11px] font-bold text-ash">{tag.posts} posts this week</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
