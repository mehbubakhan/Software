import React from 'react'
import { Link } from 'react-router-dom'

export default function TestsHub({ playClick }) {
  const tests = [
    { id: 'english', name: 'English Test' },
    { id: 'bangla', name: 'বাংলা পরীক্ষা' },
    { id: 'math', name: 'Math Test' },
    { id: 'shape', name: 'Shape Test' },
  ]

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

      {/* Sticky Tape Buttons */}
      <div className="z-20 flex flex-col gap-6 w-full max-w-sm mt-8">
        {tests.map(test => (
          <Link
            key={test.id}
            to={`/dashboard/child/tests/${test.id}`}
            onClick={playClick}
            className="relative flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer drop-shadow-md group"
          >
            <img 
              src="/assets/child-mode/pink_button.png" 
              className="absolute inset-0 w-full h-full object-fill opacity-90 drop-shadow-sm group-hover:brightness-110 transition-all" 
              alt="sticky tape" 
            />
            <span className="relative z-10 text-2xl font-black text-[#1e5871] drop-shadow-sm italic tracking-wide">
              {test.name}
            </span>
          </Link>
        ))}
      </div>
      
      <Link 
        to="/dashboard/child"
        onClick={playClick}
        className="z-20 mt-12 w-24 hover:-translate-x-2 transition cursor-pointer inline-block"
      >
        <img src="/assets/child-mode/BackButton.png" alt="Back" className="w-full drop-shadow-md hover:drop-shadow-xl" />
      </Link>
    </div>
  )
}
