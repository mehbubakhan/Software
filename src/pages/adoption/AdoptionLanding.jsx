import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Search, FileCheck, Users } from 'lucide-react';

export default function AdoptionLanding() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 p-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
          <Heart className="h-6 w-6" /> BabyCare+ Adoption
        </h1>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-600 font-medium px-4 py-2 hover:text-slate-900 transition-colors">Log In</Link>
          <Link to="/signup" className="bg-rose-600 text-white px-5 py-2 rounded-full font-medium shadow-md shadow-rose-200 hover:bg-rose-700 hover:shadow-lg transition-all">Sign Up</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <section className="text-center py-20 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-slate-900 mb-6"
          >
            Find the missing piece <br/><span className="text-rose-500">of your family</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Connect with verified orphanages, meet amazing children, and begin your secure, guided adoption journey today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/signup/parent" className="bg-slate-900 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-xl shadow-slate-300 hover:bg-slate-800 hover:-translate-y-1 transition-all">
              Start Your Journey
            </Link>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-blue-500" />}
            title="Browse Safely"
            desc="View verified orphanage listings and securely access protected child profiles."
          />
          <FeatureCard 
            icon={<FileCheck className="h-8 w-8 text-emerald-500" />}
            title="Verified Process"
            desc="Our multi-step verification ensures all legal and financial documents are securely checked."
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title="Guided Support"
            desc="Get professional counselling and legal advice right from your dashboard."
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-rose-100 transition-all duration-300 group">
      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
