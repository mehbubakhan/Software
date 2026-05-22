import React from 'react'

const criteria = [
  ['Punctuality', 4.8],
  ['Child handling', 4.9],
  ['Communication', 4.7],
  ['Safety awareness', 5.0],
  ['Professionalism', 4.8]
]

export default function Reviews(){
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Reviews & Ratings</h3>
        <p className="mt-1 text-sm text-slate-600">Parent feedback and issue reports help build trust and improve care quality.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        {criteria.map(([label, score]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-emerald-700">{score}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="font-black text-slate-950">Recent feedback</h4>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-slate-900">Excellent communication and calm safety handling.</p>
            <p className="mt-1 text-sm text-slate-600">Rating: 5.0</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-slate-900">Arrived on time and shared activity updates throughout the session.</p>
            <p className="mt-1 text-sm text-slate-600">Rating: 4.8</p>
          </div>
        </div>
      </section>
    </div>
  )
}
