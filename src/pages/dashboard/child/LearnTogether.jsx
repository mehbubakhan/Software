import React, { useState } from 'react'

export default function LearnTogether({ playClick, addCoins }) {
  const [room, setRoom] = useState('')
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()
    if (!room.trim()) return
    playClick()
    setJoined(true)
    setMessages([{ id: 1, text: `Welcome to room ${room}!`, sender: 'System' }])
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    playClick()
    setMessages([...messages, { id: Date.now(), text: input, sender: 'You' }])
    setInput('')
    
    // Simulate a reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, text: "Wow, cool drawing!", sender: 'Friend' }])
      addCoins(5)
    }, 2000)
  }

  if (!joined) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center mt-12">
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Learn Together! 👥</h2>
        <p className="text-slate-500 mb-8">Join a collaborative learning session with friends</p>
        
        <form onSubmit={handleJoin} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 max-w-md mx-auto">
          <label className="block text-left font-bold text-slate-700 mb-2">Enter Room Name:</label>
          <input 
            type="text" 
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 mb-6 focus:border-pink-500 outline-none"
            placeholder="e.g. happy-turtles"
          />
          <button type="submit" className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition">
            Join Session
          </button>
        </form>

        <div className="mt-8 text-left max-w-md mx-auto text-slate-500 text-sm">
          <p className="font-bold mb-2">What you can do together:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Collaborative drawing on a shared canvas</li>
            <li>Chat with your friends</li>
            <li>Solve puzzles together</li>
            <li>Earn coins for teamwork</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Collaborative Learning 👥</h2>
        <span className="px-4 py-1 bg-pink-100 text-pink-700 font-bold rounded-full">Room: {room}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-[600px]">
        {/* Mock Shared Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span> Shared Canvas
          </h3>
          <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            (Draw here... feature simulated for now)
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-700">💬 Chat</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`max-w-[85%] rounded-xl p-3 text-sm ${msg.sender === 'You' ? 'bg-pink-500 text-white ml-auto' : msg.sender === 'System' ? 'bg-slate-200 text-slate-600 mx-auto text-xs text-center' : 'bg-white border border-slate-100 text-slate-800 mr-auto'}`}>
                {msg.sender !== 'You' && msg.sender !== 'System' && <div className="font-bold text-xs text-pink-600 mb-1">{msg.sender}</div>}
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-pink-500 text-sm"
            />
            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-pink-600">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}
