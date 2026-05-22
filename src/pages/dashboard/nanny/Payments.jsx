import React from 'react'

const payments = [
  { period: 'This week', amount: '$320', status: 'Pending' },
  { period: 'Last week', amount: '$450', status: 'Paid' },
  { period: 'This month', amount: '$1,240', status: 'In progress' }
]

export default function Payments(){
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Payments</h3>
        <p className="mt-1 text-sm text-slate-600">Optional salary tracking, payment summaries, gateway status, and history.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {payments.map(payment => (
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
              <tr className="border-t"><td className="py-3 pr-4">After-school care</td><td className="py-3 pr-4">May 20</td><td className="py-3 pr-4">$80</td><td className="py-3 pr-4">Paid</td></tr>
              <tr className="border-t"><td className="py-3 pr-4">Weekend care</td><td className="py-3 pr-4">May 18</td><td className="py-3 pr-4">$140</td><td className="py-3 pr-4">Paid</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
