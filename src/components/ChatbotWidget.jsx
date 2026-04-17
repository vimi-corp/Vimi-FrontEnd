import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '@/lib/api';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    id: 1, text: "Hi there! I am the Vimi Dashboard Assistant. How can I help you?", isBot: true
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      // Determine intent simply based on keywords
      let intent = 'unknown';
      let lower = userText.toLowerCase();
      if (lower.includes('sale') || lower.includes('revenue')) intent = 'sales_today';
      if (lower.includes('order')) intent = 'order_count';
      if (lower.includes('top product') || lower.includes('best product')) intent = 'top_product';

      // Send to webhook
      const res = await api.post('/api/chatbot/query', { intent });
      if (res.data && res.data.response) {
        setMessages(prev => [...prev, { id: Date.now(), text: res.data.response, isBot: true }]);
      }
    } catch (err) {
      console.error("Chatbot webhook failed", err);
      setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, I am facing technical difficulties.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-canva-purple rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform z-50">
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 transform origin-bottom-right transition-all">
          <div className="bg-canva-purple text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare size={18} />
              Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="h-96 p-4 overflow-y-auto space-y-3 bg-slate-50 flex-1">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`text-sm px-4 py-2 rounded-2xl max-w-[85%] ${
                  m.isBot 
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm' 
                    : 'bg-canva-purple text-white rounded-br-sm shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-sm px-4 py-2 text-sm flex gap-1 items-center">
                  <span className="animate-bounce inline-block">.</span>
                  <span className="animate-bounce inline-block" style={{animationDelay: '150ms'}}>.</span>
                  <span className="animate-bounce inline-block" style={{animationDelay: '300ms'}}>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input 
              type="text" 
              className="flex-1 text-sm bg-slate-100 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-canva-purple/30"
              placeholder="Ask about sales, orders..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-canva-purple text-white p-2 rounded-xl hover:bg-canva-purple-hover disabled:opacity-50 transition-colors">
              <Send size={18} className="transform translate-x-px -translate-y-px" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
