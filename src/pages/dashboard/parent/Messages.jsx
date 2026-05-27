import React, { useState, useEffect } from 'react'

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Mock conversations for MVP
    setConversations([
      { id: 1, name: 'Happy Kids Daycare', role: 'Daycare Admin', lastMsg: 'Your child had a great day!', unread: 2 },
      { id: 2, name: 'Kamrun Nahar', role: 'Nanny', lastMsg: 'I will be there at 9 AM tomorrow.', unread: 0 },
      { id: 3, name: 'Dr. Sarah', role: 'Pediatrician', lastMsg: 'The test results are normal.', unread: 1 }
    ])
  }, [])

  const openChat = (conv) => {
    setActiveChat(conv)
    setMessages([
      { id: 1, text: 'Hello, how is my child doing?', sender: 'me', time: '10:00 AM' },
      { id: 2, text: conv.lastMsg, sender: 'them', time: '10:05 AM' }
    ])
  }

  return (
    <div className="flex h-[calc(100vh-100px)] max-w-6xl mx-auto bg-[#1A1D27] rounded-3xl border border-[#2A2E3D] overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-[#2A2E3D] flex flex-col bg-[#141720]">
        <div className="p-5 border-b border-[#2A2E3D]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><span>💬</span> Messages</h2>
          <input type="text" placeholder="Search conversations..." className="mt-4 w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => openChat(c)}
              className={`p-4 border-b border-[#2A2E3D] cursor-pointer hover:bg-white/5 transition flex items-center gap-3 ${activeChat?.id === c.id ? 'bg-fuchsia-600/10 border-l-4 border-l-fuchsia-600' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white relative shrink-0">
                {c.name.charAt(0)}
                {c.unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">{c.unread}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{c.name}</h4>
                <p className="text-[10px] text-fuchsia-400 mb-1">{c.role}</p>
                <p className="text-xs text-slate-400 truncate">{c.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#1A1D27]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-[#2A2E3D] flex justify-between items-center bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">{activeChat.name.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-white">{activeChat.name}</h3>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center">📞</button>
                <button className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center">📹</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender === 'me' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs ${msg.sender === 'me' ? 'bg-fuchsia-600' : 'bg-slate-700'}`}>
                    {msg.sender === 'me' ? 'Me' : activeChat.name.charAt(0)}
                  </div>
                  <div className={`p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-fuchsia-600 rounded-tr-none text-white' : 'bg-slate-800 rounded-tl-none text-slate-200'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-fuchsia-200 text-right' : 'text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#2A2E3D] bg-[#141720]">
              <div className="flex items-center gap-3 bg-slate-900 rounded-full px-4 py-2 border border-slate-700 focus-within:border-fuchsia-500 transition">
                <button className="text-slate-400 hover:text-fuchsia-400 text-xl">+</button>
                <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent text-sm text-white focus:outline-none" />
                <button className="w-8 h-8 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center shadow-lg transition">↑</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <div className="w-24 h-24 mb-4 opacity-20 bg-fuchsia-500 rounded-full blur-xl absolute mix-blend-screen"></div>
            <span className="text-6xl mb-4 relative z-10">💬</span>
            <p className="relative z-10">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
