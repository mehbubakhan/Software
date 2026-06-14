import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import api from '../../../services/api'

export default function Payments(){
  const navigate = useNavigate()
  const [payments, setPayments] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/nanny/payments')
        setPayments(res.data.data)
      } catch (err) {
        console.error('Error fetching payments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  if (loading) {
    return <div className="p-4 text-slate-500">Loading payments...</div>
  }

  if (!payments) {
    return <div className="p-4 text-slate-500">Failed to load payments.</div>
  }

  return (
    <div className="space-y-5">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h3 className="text-xl font-black text-slate-950">Payments</h3>
        <p className="mt-1 text-sm text-slate-600">Optional salary tracking, payment summaries, gateway status, and history.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {payments.summaries.map(payment => (
          <div key={payment.period} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{payment.period}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{payment.amount}</p>
            <p className="mt-2 text-sm font-bold text-cyan-700">{payment.status}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="font-black text-slate-950">Payment history</h4>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2 pr-4">Session</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-slate-800">
              {payments.history.map((hist, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-3 pr-4">{hist.session}</td>
                  <td className="py-3 pr-4">{hist.date}</td>
                  <td className="py-3 pr-4">{hist.amount}</td>
                  <td className="py-3 pr-4">{hist.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
