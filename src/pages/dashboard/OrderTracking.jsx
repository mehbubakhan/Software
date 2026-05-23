import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderTracking() {
  const navigate = useNavigate();

  const timelineSteps = [
    { label: 'Order Placed', date: 'Jan 4, 2026 10:30 AM', status: 'completed' },
    { label: 'Order Confirmed', date: 'Jan 5, 2026 11:15 AM', status: 'completed' },
    { label: 'Shipped', date: 'Jan 7, 2026 2:45 PM', status: 'completed' },
    { label: 'In Transit', date: 'Jan 8, 2026 9:00 AM', status: 'current' },
    { label: 'Out for Delivery', date: 'Estimated Jan 11, 2026', status: 'pending' },
    { label: 'Delivered', date: 'Estimated Jan 12, 2026', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8">
      <button onClick={() => navigate('/dashboard/marketplace')} className="flex items-center gap-2 text-brand-violet hover:text-white transition mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Shop
      </button>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Order #SMAQTP</h1>
            <p className="text-sm text-slate-400">Placed on 1/4/2026</p>
            <div className="mt-6 flex gap-12">
              <div>
                <p className="text-xs text-slate-500 mb-1">Tracking Number</p>
                <p className="text-sm font-bold">TRKSMAQTP</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Shipping Address</p>
                <p className="text-sm font-bold">123 Main St, New York, NY 10001</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-brand-purple/20 text-brand-violet px-4 py-1 rounded-full text-sm font-bold border border-brand-purple/30 mb-2">In Transit</span>
            <p className="text-xs text-slate-400 block">Est. Delivery: 1/12/2026</p>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-8">Tracking Timeline</h2>
          <div className="relative border-l-2 border-[#2A2E3D] ml-4 space-y-8 pb-4">
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative pl-8">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                  step.status === 'completed' ? 'bg-verified-green border-verified-green' : 
                  step.status === 'current' ? 'bg-brand-purple border-brand-purple ring-4 ring-brand-purple/30' : 
                  'bg-[#0B0E14] border-[#2A2E3D]'
                }`}>
                  {step.status === 'completed' && (
                    <svg className="w-full h-full text-white scale-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </div>
                <h3 className={`font-bold ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.label}</h3>
                <p className={`text-sm ${step.status === 'pending' ? 'text-slate-600' : 'text-slate-400'}`}>{step.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items Card */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Order Items</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2E3D]">
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=150&q=80" alt="Item" className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="font-bold text-sm">Organic Cotton Baby Onesie</p>
                  <p className="text-xs text-slate-400">Quantity: 2</p>
                </div>
              </div>
              <p className="text-sm font-bold">$49.98</p>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2E3D]">
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80" alt="Item" className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="font-bold text-sm">Educational Wooden Toy Set</p>
                  <p className="text-xs text-slate-400">Quantity: 1</p>
                </div>
              </div>
              <p className="text-sm font-bold">$39.99</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="font-bold">Total</p>
              <p className="font-bold text-xl">$89.97</p>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-[#0B0E14] border border-[#2A2E3D] rounded-2xl p-6 text-center">
          <p className="font-bold mb-2">Need Help?</p>
          <p className="text-sm text-slate-400 mb-4">Contact our support team for any questions about your order.</p>
          <button onClick={() => navigate('/dashboard/marketplace/support')} className="px-6 py-2 border border-brand-purple text-brand-violet hover:bg-brand-purple hover:text-white rounded-lg transition font-bold text-sm">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
