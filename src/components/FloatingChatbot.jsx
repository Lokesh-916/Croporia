import { useState, useRef, useEffect } from "react"
import { BotMessageSquare, X, Send, Maximize2, Minimize2 } from "lucide-react"
export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState([{ type: "bot", text: "Hello! I am your Croporia AI Agronomist. Ask me anything about crop schedules, diseases, or soil management!" }])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatHistory, isOpen, loading])
  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    const userMessage = question
    setQuestion("")
    setChatHistory(prev => [...prev, { type: "user", text: userMessage }])
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: userMessage }) })
      const data = await res.json()
      if (!res.ok) setChatHistory(prev => [...prev, { type: "error", text: data.detail || "Assistant error" }])
      else setChatHistory(prev => [...prev, { type: "bot", text: data.answer || "" }])
    } catch { setChatHistory(prev => [...prev, { type: "error", text: "Cannot reach RAG service on port 8000." }]) }
    finally { setLoading(false) }
  }
  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-[999] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 bg-forest rounded-full p-4 group flex items-center justify-center border border-white/20" aria-label="Talk to AI Agronomist">
          <BotMessageSquare className="w-7 h-7 text-white" />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-black-forest text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">Ask AI Assistant</div>
        </button>
      )}
      {isOpen && (
        <div className={`fixed z-[999] bg-white shadow-2xl transition-all duration-300 flex flex-col border border-olive/30 overflow-hidden ${isExpanded ? "bottom-4 right-4 left-4 top-4 rounded-2xl md:bottom-10 md:right-10 md:left-10 md:top-10" : "bottom-4 right-4 w-full max-w-[360px] h-[550px] rounded-2xl sm:bottom-6 sm:right-6"}`}>
          <div className="bg-black-forest px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2 text-white"><BotMessageSquare className="w-5 h-5" /><span className="font-cinzel font-semibold text-sm tracking-wide">AI Agronomist</span></div>
            <div className="flex items-center gap-2 text-white/80">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:text-white hover:bg-forest/50 rounded transition-colors hidden sm:block">{isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:text-white hover:bg-forest/50 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-frosted/30 flex flex-col gap-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] shadow-sm ${msg.type === "user" ? "bg-forest text-white rounded-br-sm" : msg.type === "error" ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-sm" : "bg-white text-black-forest border border-olive/30 rounded-bl-sm"}`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-olive/30 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-forest rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-forest rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-forest rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
          <form onSubmit={handleAsk} className="p-3 bg-white border-t border-olive/20 shrink-0">
            <div className="flex relative items-center">
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a farming question..." className="w-full bg-frosted/50 border border-olive/40 text-black-forest text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-shadow" disabled={loading} />
              <button type="submit" disabled={!question.trim() || loading} className="absolute right-1 w-9 h-9 flex items-center justify-center bg-forest text-white rounded-full hover:bg-black-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Send"><Send className="w-4 h-4 ml-0.5" /></button>
            </div>
            <p className="text-center mt-2 text-[9px] text-ash">Powered by Croporia RAG</p>
          </form>
        </div>
      )}
    </>
  )
}