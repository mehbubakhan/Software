import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathFormatMenu({ playClick }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (playClick) playClick();
    navigate(path);
  };

  return (
    <div className="relative min-h-[600px] w-full rounded-3xl overflow-hidden bg-fuchsia-50 shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-white">
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/child-mode/CommonPage.png')" }}
      ></div>

      <img src="/assets/child-mode/cloud.gif" className="absolute top-10 left-10 w-24 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute top-20 right-20 w-32 opacity-80 z-10" alt="cloud" />

      <h1 className="text-5xl font-black text-emerald-600 z-20 mb-12 drop-shadow-md">Learn Math!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-20 w-full max-w-3xl">
        <button 
          onClick={() => handleNav('/dashboard/child/learn/math/bangla')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-blue-200 bg-blue-500"
        >
          <span className="relative text-3xl font-black text-white drop-shadow-md">Number Bangla</span>
        </button>

        <button 
          onClick={() => handleNav('/dashboard/child/learn/math/bangla-spelling')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-cyan-200 bg-cyan-500"
        >
          <span className="relative text-2xl font-black text-white drop-shadow-md text-center px-4">Number Bangla Spelling</span>
        </button>

        <button 
          onClick={() => handleNav('/dashboard/child/learn/math/english')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-purple-200 bg-purple-500"
        >
          <span className="relative text-3xl font-black text-white drop-shadow-md">Number English</span>
        </button>

        <button 
          onClick={() => handleNav('/dashboard/child/learn/math/english-spelling')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-pink-200 bg-pink-500"
        >
          <span className="relative text-2xl font-black text-white drop-shadow-md text-center px-4">Number English Spelling</span>
        </button>
      </div>

      <button 
        onClick={() => handleNav('/dashboard/child/learn')}
        className="z-20 mt-12 w-24 hover:-translate-x-2 transition cursor-pointer"
      >
        <img src="/assets/child-mode/BackButton.png" alt="Back" className="w-full drop-shadow-md hover:drop-shadow-xl" />
      </button>
    </div>
  );
}
