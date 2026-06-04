import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Brain, Video, Briefcase, 
  ShoppingBag, HeartHandshake, BellRing, Bot, ArrowLeft 
} from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    { icon: <Briefcase className="w-6 h-6 text-[#1C2541]" />, title: 'Parent Dashboard', desc: 'Manage your childcare network effortlessly.' },
    { icon: <Brain className="w-6 h-6 text-[#F4A261]" />, title: 'Child Learning Mode', desc: 'Interactive educational content tailored for kids.' },
    { icon: <Video className="w-6 h-6 text-[#1C2541]" />, title: 'Daycare Monitoring', desc: 'Live CCTV and activity tracking.' },
    { icon: <HeartHandshake className="w-6 h-6 text-[#F4A261]" />, title: 'Nanny Hiring', desc: 'Connect with verified caregivers safely.' },
    { icon: <ShoppingBag className="w-6 h-6 text-[#1C2541]" />, title: 'Child Marketplace', desc: 'Securely buy and sell essential goods.' },
    { icon: <ShieldCheck className="w-6 h-6 text-[#F4A261]" />, title: 'Ethical Adoption', desc: 'Transparent and welfare-focused processes.' },
    { icon: <BellRing className="w-6 h-6 text-[#1C2541]" />, title: 'Live Notifications', desc: 'Instant updates on your child\'s well-being.' },
    { icon: <Bot className="w-6 h-6 text-[#F4A261]" />, title: 'AI Parenting Assistant', desc: '24/7 smart guidance for parents.' },
  ];

  const securityFeatures = [
    'Child-safe platform', 'End-to-end encryption', 'Verified organizations', 
    'Parent protection', 'AI moderation', 'Safe learning environment'
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#030000] font-sans overflow-x-hidden selection:bg-[#E8C1A0]">
      
      <div className="absolute top-0 w-full p-6 md:p-8 z-30 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF]/60 backdrop-blur-md border border-[#D9D9D9] shadow-sm text-[#0B132B] hover:bg-[#FFFFFF] hover:-translate-y-0.5 transition-all font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8C1A0] to-[#DDD3D3] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#F4A261] to-[#EFEFEF] blur-[150px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#FFFFFF]/60 backdrop-blur-md border border-[#FFFFFF] shadow-sm text-sm font-semibold tracking-wide text-[#1C2541] uppercase">
            Introducing Minimate
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0B132B] mb-6 leading-[1.1]">
            Smart Childcare & <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A261] to-[#E8C1A0]">
              Parenting Ecosystem
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#5F5A5F] max-w-2xl mb-10 leading-relaxed">
            One secure platform for parenting, child learning, daycare, nanny hiring, adoption, safety, and child development.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#0B132B] text-[#FFFFFF] font-semibold shadow-xl shadow-[#0B132B]/30 hover:bg-[#1C2541] hover:-translate-y-1 transition-all duration-300"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FFFFFF] text-[#1C2541] font-semibold shadow-sm border border-[#D9D9D9] hover:border-[#1C2541] hover:bg-[#EFEFEF] hover:-translate-y-1 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B132B] mb-4">Everything you need.</h2>
          <p className="text-[#5F5A5F] max-w-xl mx-auto">A fully integrated suite of tools designed to bring absolute simplicity to childcare.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-[#FFFFFF]/70 backdrop-blur-xl p-8 rounded-3xl border border-[#FFFFFF] shadow-lg shadow-[#D9D9D9]/50 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ECEBEB] flex items-center justify-center mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#030000] mb-2">{feature.title}</h3>
              <p className="text-[#5F5A5F] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECURITY SECTION --- */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-[#0B132B] text-[#FFFFFF] mt-12 rounded-[3rem] mx-4 mb-24 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <ShieldCheck className="w-16 h-16 mx-auto text-[#F4A261] mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#FFFFFF]">Uncompromising Security.</h2>
          <p className="text-[#BFC1C2] max-w-2xl mx-auto mb-12 text-lg">
            "My child is safe here." We've built Minimate with military-grade security and advanced AI moderation to ensure your family's safety is never compromised.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {securityFeatures.map((sf, i) => (
              <div key={i} className="px-5 py-2.5 rounded-full bg-[#1C2541] border border-[#5F5A5F] backdrop-blur-md text-sm font-medium text-[#EFEFEF] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E8C1A0]" />
                {sf}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-[#D9D9D9] text-center text-[#5F5A5F]">
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
          <a href="#" className="hover:text-[#F4A261] transition-colors">About</a>
          <a href="#" className="hover:text-[#F4A261] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#F4A261] transition-colors">Child Safety</a>
          <a href="#" className="hover:text-[#F4A261] transition-colors">Contact</a>
          <a href="#" className="hover:text-[#F4A261] transition-colors">Terms & Conditions</a>
        </div>
        <p className="text-sm">© 2026 Minimate Childcare Ecosystem. All rights reserved.</p>
      </footer>

    </div>
  );
}
