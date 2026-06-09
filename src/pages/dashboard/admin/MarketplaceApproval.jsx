import React, { useState } from 'react';
import { ShoppingCart, Search, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MarketplaceApproval() {
  const [search, setSearch] = useState('');
  
  const mockSellers = [
    { id: 401, sellerName: 'Bob Dylan', storeName: 'Bob Toys Emporium', category: 'Toys & Games', safety: 'Safe', approval: 'Approved' },
    { id: 402, sellerName: 'Alice Smith', storeName: 'Organic Baby Foods', category: 'Food', safety: 'Pending Review', approval: 'Pending' },
    { id: 403, sellerName: 'John Doe', storeName: 'Discount Diapers', category: 'Accessories', safety: 'Flagged', approval: 'Suspended' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-amber-500" /> Marketplace Registration Approval
          </h1>
          <p className="text-slate-500 font-medium mt-2">Approve sellers, verify products, and ensure all items are safe for children.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sellers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">Seller Name</th>
                <th className="py-4 px-6">Store Name</th>
                <th className="py-4 px-6">Product Category</th>
                <th className="py-4 px-6">Safety Status</th>
                <th className="py-4 px-6">Verification Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">{seller.sellerName}</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{seller.storeName}</td>
                  <td className="py-4 px-6 text-slate-500">{seller.category}</td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${seller.safety === 'Safe' ? 'text-emerald-600' : seller.safety === 'Flagged' ? 'text-red-600' : 'text-amber-600'}`}>
                      {seller.safety === 'Safe' ? <ShieldCheck className="w-4 h-4" /> : seller.safety === 'Flagged' ? <AlertTriangle className="w-4 h-4" /> : null} {seller.safety}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${seller.approval === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : seller.approval === 'Suspended' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {seller.approval}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">Approve</button>
                      <button className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition">Reject</button>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition">Audit Products</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
