import React, { useState } from 'react'

const initialMessages = [
  { from: 'Parent', text: 'Please let me know after lunch.', type: 'Booking reminder' },
  { from: 'You', text: 'Lunch update and nap time will be shared here.', type: 'Care update' }
]

export default function Communication(){
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')

  const send = e => {
    e.preventDefault()
    if (!text.trim()) return
    setMessages(prev => [...prev, { from: 'You', text: text.trim(), type: 'Message' }])
    setText('')
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Parent Communication</h3>
        <p className="mt-1 text-sm text-slate-600">Chat, emergency messaging, call notes, booking reminders, and safety alerts live here.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">{message.from}</p>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">{message.type}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a parent update"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
            <button className="rounded-lg bg-cyan-600 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500" type="submit">
              Send
            </button>
          </form>
        </section>

        <aside className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <h4 className="font-black text-slate-950">Quick actions</h4>
          <div className="mt-4 space-y-2">
            {['Voice call note', 'Video call note', 'Emergency message', 'Schedule reminder'].map(item => (
              <button key={item} className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 hover:border-emerald-400">
                {item}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
