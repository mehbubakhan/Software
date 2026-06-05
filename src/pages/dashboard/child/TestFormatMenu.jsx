import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const FORMATS = {
  bangla: [
    { id: 'shoroborno', name: 'স্বরবর্ণ' },
    { id: 'benjonborno', name: 'ব্যঞ্জনবর্ণ' },
    { id: 'medium-mixed', name: 'মধ্যম' },
    { id: 'hard', name: 'কঠিন' }
  ],
  english: [
    { id: 'uppercase', name: 'UPPERCASE' },
    { id: 'lowercase', name: 'lowercase' },
    { id: 'words', name: 'Wordmaking', fullWidth: true },
    { id: 'medium-mixed', name: 'Medium (Mixed)' },
    { id: 'hard', name: 'Hard' }
  ],
  math: [
    { id: 'bangla-numbers', name: 'সংখ্যা (১-১০০)' },
    { id: 'english-numbers', name: 'Numbers (1-100)' },
    { id: 'medium-mixed', name: 'Medium (Mixed)', fullWidth: true },
    { id: 'hard', name: 'Hard' }
  ],
  shape: [
    { id: 'shapes', name: 'Shapes Test' },
    { id: 'colors', name: 'Colors Test' },
    { id: 'medium-mixed', name: 'Medium (Mixed)', fullWidth: true },
    { id: 'hard', name: 'Hard' }
  ]
}

const TITLE_MAP = {
  bangla: 'বাংলা পরীক্ষা',
  english: 'English Basic Test',
  math: 'Math Basic Test',
  shape: 'Shape & Color Test'
}

export default function TestFormatMenu({ playClick }) {
  const { subject } = useParams()
  const navigate = useNavigate()
  
  const options = FORMATS[subject] || []
  const title = TITLE_MAP[subject] || 'Test Setup'

  if (options.length === 0) {
    return (
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-slate-800">Coming Soon!</h2>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-slate-200 rounded-full font-bold">Go Back</button>
      </div>
    )
  }

  return (
    <div className="relative min-h-[600px] w-full rounded-3xl overflow-hidden bg-[#5bc2f2] shadow-2xl flex flex-col items-center p-8 border-4 border-white">
      {/* Background from AOOPProject */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/child-mode/CommonPage.png')" }}
      ></div>

      {/* Decorative Clouds */}
      <img src="/assets/child-mode/cloud.gif" className="absolute top-10 left-10 w-24 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute top-32 right-12 w-32 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute bottom-20 left-1/4 w-28 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute bottom-10 right-1/4 w-24 opacity-80 z-10" alt="cloud" />

      {/* Title */}
      <div className="z-20 text-center mb-8 bg-white/60 px-6 py-2 rounded-full shadow-sm">
        <h1 className="text-2xl font-black text-[#1e5871]">{title}</h1>
      </div>

      {/* Sticky Tape Buttons */}
      <div className="z-20 flex flex-wrap justify-center gap-x-12 gap-y-6 w-full max-w-3xl mt-4">
        {options.map(opt => (
          <Link
            key={opt.id}
            to={`/dashboard/child/tests/play/${subject}/${opt.id}`}
            onClick={playClick}
            className={`relative flex items-center justify-center h-20 hover:scale-105 transition-transform cursor-pointer drop-shadow-md group ${opt.fullWidth ? 'w-full max-w-[280px]' : 'w-[280px]'}`}
          >
            <img 
              src="/assets/child-mode/pink_button.png" 
              className="absolute inset-0 w-full h-full object-fill opacity-90 drop-shadow-sm group-hover:brightness-110 transition-all" 
              alt="sticky tape" 
            />
            <span className="relative z-10 text-xl font-black text-[#1e5871] drop-shadow-sm italic tracking-wide">
              {opt.name}
            </span>
          </Link>
        ))}
      </div>
      
      <button 
        onClick={() => { playClick(); navigate(-1); }}
        className="z-20 mt-12 w-24 hover:-translate-x-2 transition cursor-pointer inline-block"
      >
        <img src="/assets/child-mode/BackButton.png" alt="Back" className="w-full drop-shadow-md hover:drop-shadow-xl" />
      </button>
    </div>
  )
}
