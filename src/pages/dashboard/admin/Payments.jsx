import React, { useState } from 'react';
import { CreditCard, DollarSign, Download, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function Payments() {
  const [activeTab, setActiveTab] = useState('escrow'); // escrow, completed, refunds

  // Mock data for MVP
  const transactions = [
    { id: 'TXN-001', type: 'escrow', amount: 4500, user: 'John Doe (Parent)', nanny: 'Kamrun Nahar', status: 'Held in Escrow', date: '2026-06-08' },
    { id: 'TXN-002', type: 'completed', amount: 3200, user: 'Sarah Smith (Parent)', nanny: 'Ayesha Begum', status: 'Released', date: '2026-06-07' },
    { id: 'TXN-003', type: 'refunds', amount: 1500, user: 'Mike Johnson (Parent)', nanny: 'N/A', status: 'Refunded', date: '2026-06-05' },
    { id: 'TXN-004', type: 'escrow', amount: 8000, user: 'Ali Rahman (Parent)', nanny: 'Fatima Zaman', status: 'Held in Escrow', date: '2026-06-09' },
  ];

  const filteredTx = transactions.filter(t => t.type === activeTab);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-emerald-600" /> Payments & Billing
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Manage platform escrow, release nanny salaries, and process refunds.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">In Escrow</p>
            <h3 className="text-2xl font-black text-slate-900">৳12,500</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Total Released</p>
            <h3 className="text-2xl font-black text-slate-900">৳85,400</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Total Refunded</p>
            <h3 className="text-2xl font-black text-slate-900">৳4,200</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex gap-6">
          <button onClick={() => setActiveTab('escrow')} className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'escrow' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Pending Escrow</button>
          <button onClick={() => setActiveTab('completed')} className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'completed' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Completed Transfers</button>
          <button onClick={() => setActiveTab('refunds')} className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'refunds' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Refunds</button>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider font-black border-b border-slate-100">
                <th className="pb-4">Transaction ID</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Parent (Payer)</th>
                <th className="pb-4">Nanny (Payee)</th>
                <th className="pb-4">Date</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">No transactions found in this category.</td>
                </tr>
              ) : (
                filteredTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition">
                    <td className="py-5 font-mono text-xs font-bold text-slate-500">{tx.id}</td>
                    <td className="py-5 font-black text-slate-900">৳{tx.amount.toLocaleString()}</td>
                    <td className="py-5 text-slate-700 font-medium">{tx.user}</td>
                    <td className="py-5 text-slate-700 font-medium">{tx.nanny}</td>
                    <td className="py-5 text-slate-500 font-mono text-sm">{tx.date}</td>
                    <td className="py-5 text-right">
                      {tx.type === 'escrow' ? (
                        <div className="flex justify-end gap-2">
                          <button className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-lg transition">Release</button>
                          <button className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-xs rounded-lg transition">Refund</button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${tx.type === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                          {tx.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
