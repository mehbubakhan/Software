import React from 'react';

export default function FeesAndPayment() {
  const payments = [
    { id: 1, parent: 'Sarah Johnson', child: 'Emma', amount: '$900', date: '2026-05-25', status: 'Paid', method: 'Credit Card' },
    { id: 2, parent: 'Michael Brown', child: 'Oliver', amount: '$250', date: '2026-05-24', status: 'Pending', method: 'Bank Transfer' },
    { id: 3, parent: 'Jessica Lee', child: 'Sophia', amount: '$15', date: '2026-05-26', status: 'Paid', method: 'Cash' },
    { id: 4, parent: 'David Smith', child: 'Liam', amount: '$900', date: '2026-05-20', status: 'Paid', method: 'Credit Card' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Fees & Payment Management</h1>
          <p className="text-slate-500">Track payments and generate invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Total Revenue (Month)</p>
          <p className="text-3xl font-bold text-green-600">$12,400</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold text-amber-500">$2,100</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Expected Revenue</p>
          <p className="text-3xl font-bold text-purple-600">$14,500</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="font-bold text-lg">Payment History</h2>
          <button className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition">Export CSV</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Parent</th>
                <th className="p-4 font-bold">Child</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Method</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payments.map(payment => (
                <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-800">{payment.parent}</td>
                  <td className="p-4 text-slate-600">{payment.child}</td>
                  <td className="p-4 font-bold">{payment.amount}</td>
                  <td className="p-4 text-slate-600">{payment.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
