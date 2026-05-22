import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DaycareChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'daycare',
      text: 'Hello! Welcome to Little Stars Daycare. How can we help you today?',
      time: '10:15 AM'
    },
    {
      id: 2,
      sender: 'user',
      text: "Hi! I'm interested in enrolling my daughter. She's 3 years old.",
      time: '10:18 AM'
    },
    {
      id: 3,
      sender: 'daycare',
      text: "That's wonderful! We have spots available in our preschool program. Would you like to schedule a tour?",
      time: '10:20 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputValue('');
  };

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans pb-24">
      <div className="max-w-4xl mx-auto mt-4 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1a1c2d] border border-slate-700 rounded-t-2xl p-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition text-sm font-semibold">
              ← Back to Details
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Little Stars Daycare</h1>
              <span className="text-sm text-slate-400 flex items-center gap-1">
                <span className="text-yellow-400 leading-none">★</span> 4.8 (124 reviews)
              </span>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">🔴 Live CCTV</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">$1,200/mo</div>
            <div className="text-xs text-slate-400">Full-Time Care</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-[#1a1c2d] border-x border-slate-700 flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-fuchsia-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'}`}>
                {msg.text}
              </div>
              <div className={`text-xs text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-[#1a1c2d] border border-slate-700 rounded-b-2xl p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-[#111322] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
            >
              <span>📨</span> Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
