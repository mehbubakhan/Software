import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../services/api'

const featureCards = [
  {
    title: 'Verified profile',
    path: 'profile',
    text: 'Manage personal details, experience, skills, certificates, identity status, ratings, and admin approval.'
  },
  {
    title: 'Job requests',
    path: 'applications',
    text: 'Review parent hiring requests, child details, schedules, pricing, booking status, and conflicts.'
  },
  {
    title: 'Activity reports',
    path: 'update',
    text: 'Send meal, sleep, playtime, mood, health, attendance, photo, and daily care updates.'
  },
  {
    title: 'Safety response',
    path: 'safety',
    text: 'Answer smart safety checks, share location status, and trigger emergency SOS alerts.'
  },
  {
    title: 'Availability',
    path: 'availability',
    text: 'Set full-time, part-time, hourly, and weekly schedule availability for parent bookings.'
  },
  {
    title: 'Communication',
    path: 'communication',
    text: 'Keep parent messages, emergency notes, call options, and reminders in one place.'
  },
  {
    title: 'Reviews',
    path: 'reviews',
    text: 'Track parent feedback across punctuality, child handling, communication, safety, and professionalism.'
  },
  {
    title: 'Payments',
    path: 'payments',
    text: 'Review salary summaries, weekly or monthly earnings, payment status, and history.'
  }
]

export default function Overview(){
  const [summary, setSummary] = useState({ children: 0, applications: 0, availability: 0 })

  useEffect(() => {
    let active = true
    const load = async () => {
      const next = { children: 0, applications: 0, availability: 0 }
      try {
        const children = await api.get('/children/assigned')
        next.children = children.data?.data?.length || 0
      } catch (e) {}
      try {
        const apps = await api.get('/applications/mine')
        next.applications = apps.data?.data?.length || 0
      } catch (e) {}
      try {
        const availability = await api.get('/nanny/availability')
        next.availability = Object.values(availability.data?.data || {}).filter(Boolean).length
      } catch (e) {}
      if (active) setSummary(next)
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Active children</p>
          <p className="mt-2 text-3xl font-black text-cyan-700">{summary.children}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Job requests</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">{summary.applications}</p>
        </div>
        <div className="rounded-lg border border-fuchsia-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Available days</p>
          <p className="mt-2 text-3xl font-black text-fuchsia-700">{summary.availability}</p>
        </div>
      </section>

      <section className="rounded-lg border border-red-100 bg-red-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-red-600">Safety check</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">Are you and the child safe?</h3>
            <p className="mt-1 text-sm text-slate-600">Use the safety desk for one-click confirmation, missed response handling, GPS status, and SOS escalation.</p>
          </div>
          <Link to="safety" className="inline-flex justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-500">
            Open Safety
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map(card => (
          <Link key={card.path} to={card.path} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
            <h3 className="text-base font-black text-slate-950">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
