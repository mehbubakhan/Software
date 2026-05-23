import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-violet hover:text-white transition mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Home
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">Contact Support</h1>
          <p className="text-sm text-slate-400">We're here to help! Fill out the form below and we'll get back to you within 24 hours.</p>
        </div>

        {/* Form */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Full Name *</label>
            <input type="text" placeholder="Enter your full name" className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-purple" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email Address *</label>
            <input type="email" placeholder="your.email@example.com" className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-purple" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Order Number (Optional)</label>
            <input type="text" placeholder="e.g., #SMAQTP" className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-purple" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Subject *</label>
            <select className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-purple">
              <option>Order Tracking</option>
              <option>Returns & Refunds</option>
              <option>Product Inquiry</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Message *</label>
            <textarea placeholder="Please describe your issue in detail..." rows="4" className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-purple"></textarea>
          </div>
          <button className="w-full bg-brand-purple hover:bg-violet-500 py-3 rounded-lg font-bold transition">
            Submit Request
          </button>
        </div>

        {/* FAQ */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="font-bold mb-4">Common Questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-slate-200 mb-1">How can I track my order?</p>
              <p className="text-slate-400">You can track your order using the tracking number provided in your confirmation email. Visit the order tracking page and enter your tracking number.</p>
            </div>
            <div>
              <p className="font-bold text-slate-200 mb-1">What is your return policy?</p>
              <p className="text-slate-400">We accept returns within 30 days of delivery. Items must be unused and in original packaging. Contact us to initiate a return.</p>
            </div>
            <div>
              <p className="font-bold text-slate-200 mb-1">How long does shipping take?</p>
              <p className="text-slate-400">Standard shipping typically takes 3-7 business days. Expedited shipping options are available at checkout.</p>
            </div>
          </div>
        </div>

        {/* Other Contact Ways */}
        <div className="bg-brand-card border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="font-bold mb-4">Other Ways to Reach Us</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Email</p>
              <p className="font-bold text-slate-200">support@marketplace.com</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Phone</p>
              <p className="font-bold text-slate-200">1-800-555-0123</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Hours</p>
              <p className="font-bold text-slate-200">Mon-Fri, 9AM - 6PM EST</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Live Chat</p>
              <p className="font-bold text-slate-200">Available 24/7</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
