import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShimmerButton } from '../../components/ui/ShimmerButton';
import { InfiniteMovingCards } from '../../components/ui/InfiniteMovingCards';
import { Button as MovingBorderButton } from '../../components/ui/MovingBorder';
import Navbar from '../../components/Navbar';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TOP_CONTRIBUTORS = [
  { quote: "Tip: Always test pH before applying urea.", name: "Ramesh Kumar", title: "Master Farmer · Punjab" },
  { quote: "Neem oil works best when sprayed at dawn.", name: "Anita Devi", title: "Organic Specialist · Kerala" },
  { quote: "Groundnut yields up 20% using raised beds.", name: "Venkat K.", title: "Agri Tech Expert · AP" },
  { quote: "Don't overwater seedlings in black soil.", name: "Prakash Singh", title: "Veteran Grower · MP" },
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Siddhartha M.",
    role: "Farmer",
    time: "2 hours ago",
    crop: "Tomato",
    content: "Seeing early signs of leaf curl on my tomato crop (Day 45). Tried standard copper sprays but it's spreading. Any natural remedies worked for you guys?",
    likes: 24,
    comments: 8,
    isFeatured: true, // Moving Border candidate
  },
  {
    id: 2,
    author: "Kavya Patel",
    role: "Agri Expert",
    time: "5 hours ago",
    crop: "General",
    content: "Friendly reminder: With the upcoming monsoons, ensure your field drainage channels are clear. Waterlogging for even 24 hours can destroy young root systems.",
    likes: 112,
    comments: 45,
    isFeatured: false,
  },
  {
    id: 3,
    author: "Lakshman Rao",
    role: "Farmer",
    time: "1 day ago",
    crop: "Rice",
    content: "Just finished harvesting Samba Mahsuri. Yield is looking around 22 quintals/acre this season. Used purely organic compost this time, very happy with soil quality!",
    likes: 340,
    comments: 62,
    isFeatured: false,
  }
];

export default function CommunityIndex() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const token = localStorage.getItem('croporia_token');
    if (!token) {
      setError("Please login to post.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost, cropTag: 'Discussion' })
      });

      if (res.ok) {
        const savedPost = await res.json();
        setPosts([savedPost, ...posts]);
        setNewPost("");
        setError(null);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to post.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem('croporia_token');
    if (!token) {
      setError("Please login to interact.");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
      }
    } catch (err) {
      console.error("Failed to like post");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-[#f4f7f0] min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-2">
            {[
              { icon: '🌍', label: 'Global Feed', active: true },
              { icon: '📍', label: 'Local Growers', active: false },
              { icon: '⭐', label: 'My Saved Posts', active: false },
              { icon: '❓', label: 'Ask an Expert', active: false },
            ].map(nav => (
              <button 
                key={nav.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${
                  nav.active ? 'bg-[#1a3d0a] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <span className="text-lg">{nav.icon}</span>
                {nav.label}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER FEED */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Create Post Input */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#d0e8c0] flex flex-col gap-4">
            <textarea
              rows="3"
              className="w-full resize-none text-gray-900 bg-gray-50 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-green-600/20 border border-transparent focus:border-green-600/30 transition-all placeholder:text-gray-400"
              placeholder="Ask a question, share an update, or upload a harvest photo..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs px-2 font-bold">{error}</p>}
            <div className="flex justify-between items-center px-1">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl transition-colors">📷</button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl transition-colors">🌱</button>
              </div>
              <ShimmerButton 
                text="Post to Community" 
                onClick={handlePost} 
                className="h-10 text-xs px-6" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 py-2 border-b border-gray-200">
            <button className="text-sm font-black text-gray-900 border-b-2 border-green-700 pb-2">Recent</button>
            <button className="text-sm font-bold text-gray-400 pb-2 hover:text-gray-600">Top Rated</button>
            <button className="text-sm font-bold text-gray-400 pb-2 hover:text-gray-600">Unanswered</button>
          </div>
              {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 font-bold">
                 No posts yet. Be the first to start a discussion!
               </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#d0e8c0] transition-all hover:shadow-md">
                   <div className="flex w-full justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-black">
                        {post.authorName ? post.authorName[0] : '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-gray-900">{post.authorName}</p>
                          {post.authorRole === 'Expert' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Expert</span>}
                        </div>
                        <p className="text-[11px] font-bold text-gray-400">{formatTime(post.createdAt)}</p>
                      </div>
                    </div>
                    {post.cropTag && post.cropTag !== 'Discussion' && (
                      <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">{post.cropTag}</span>
                    )}
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-4">{post.content}</p>
                  <div className="flex gap-6 border-t border-gray-100 pt-3 w-full">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className="text-xs font-bold text-gray-500 hover:text-green-700 transition-colors"
                    >
                      👍 Like ({post.likes?.length || 0})
                    </button>
                    <button className="text-xs font-bold text-gray-500 hover:text-green-700 transition-colors">💬 Reply</button>
                  </div>
                </div>
              ))
            )}
          </div>

        {/* RIGHT SIDEBAR (Infinite Cards & Trending) */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          
          <div className="bg-white rounded-2xl border border-[#d0e8c0] overflow-hidden pt-6 shadow-sm">
            <h3 className="px-6 text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Top Contributors</h3>
            <div className="pb-4">
               <InfiniteMovingCards items={TOP_CONTRIBUTORS} direction="right" speed="slow" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#d0e8c0] shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Trending Topics</h3>
            <div className="space-y-4">
              {[
                { label: '#MonsoonPrep2026', posts: '1.2k' },
                { label: '#OrganicPesticides', posts: '850' },
                { label: '#TomatoBlight', posts: '430' },
                { label: '#GovtSubsidies', posts: '210' },
              ].map(tag => (
                <div key={tag.label} className="group cursor-pointer">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{tag.label}</p>
                  <p className="text-[11px] font-bold text-gray-400">{tag.posts} posts this week</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
