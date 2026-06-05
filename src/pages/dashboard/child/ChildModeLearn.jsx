import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function ChildModeLearn({ playClick }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    // Fetch progress from backend
    api.get('/child/progress').then(res => {
      if (Array.isArray(res.data)) {
        const progMap = {};
        res.data.forEach(item => {
          progMap[item.module] = item.current_level;
        });
        setProgress(progMap);
      }
    }).catch(err => console.error('Error fetching child progress', err));
  }, []);

  const handleModuleClick = (moduleName) => {
    if (playClick) playClick();
    
    if (moduleName === 'english') {
      navigate('/dashboard/child/learn/english');
      return;
    }
    if (moduleName === 'math') {
      navigate('/dashboard/child/learn/math');
      return;
    }
    if (moduleName === 'bangla') {
      navigate('/dashboard/child/learn/bangla');
      return;
    }
    if (moduleName === 'shape') {
      navigate('/dashboard/child/learn/shapes');
      return;
    }
  };

  return (
    <div className="relative min-h-[600px] w-full rounded-3xl overflow-hidden bg-fuchsia-50 shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-white">
      {/* Background from AOOPProject */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/child-mode/CommonPage.png)' }}
      ></div>

      {/* Decorative Clouds */}
      <img src="/assets/child-mode/cloud.gif" className="absolute top-10 left-10 w-24 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute top-20 right-20 w-32 opacity-80 z-10" alt="cloud" />
      <img src="/assets/child-mode/cloud.gif" className="absolute bottom-20 left-1/4 w-28 opacity-80 z-10" alt="cloud" />

      <h1 className="text-5xl font-black text-fuchsia-600 z-20 mb-12 drop-shadow-md">Choose What to Learn!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-20 w-full max-w-3xl">
        {/* English */}
        <button 
          onClick={() => handleModuleClick('english')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-fuchsia-200"
        >
          <img src="/assets/child-mode/pink_button.png" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="bg" />
          <div className="absolute inset-0 bg-fuchsia-500/20 group-hover:bg-fuchsia-500/10 transition"></div>
          <span className="relative text-3xl font-black text-white drop-shadow-md">English (Lv {progress['english'] || 1})</span>
        </button>

        {/* Math */}
        <button 
          onClick={() => handleModuleClick('math')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-cyan-200"
        >
          <img src="/assets/child-mode/pink_button.png" className="absolute inset-0 w-full h-full object-cover opacity-80 hue-rotate-180" alt="bg" />
          <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/10 transition"></div>
          <span className="relative text-3xl font-black text-white drop-shadow-md">Math (Lv {progress['math'] || 1})</span>
        </button>

        {/* Shape */}
        <button 
          onClick={() => handleModuleClick('shape')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-amber-200"
        >
          <img src="/assets/child-mode/pink_button.png" className="absolute inset-0 w-full h-full object-cover opacity-80 hue-rotate-90" alt="bg" />
          <div className="absolute inset-0 bg-amber-500/20 group-hover:bg-amber-500/10 transition"></div>
          <span className="relative text-3xl font-black text-white drop-shadow-md">Shape (Lv {progress['shape'] || 1})</span>
        </button>

        {/* Bangla */}
        <button 
          onClick={() => handleModuleClick('bangla')}
          className="relative overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 h-32 flex items-center justify-center border-4 border-green-200"
        >
          <img src="/assets/child-mode/pink_button.png" className="absolute inset-0 w-full h-full object-cover opacity-80 hue-rotate-[270deg]" alt="bg" />
          <div className="absolute inset-0 bg-green-500/20 group-hover:bg-green-500/10 transition"></div>
          <span className="relative text-3xl font-black text-white drop-shadow-md">বাংলা (Lv {progress['bangla'] || 1})</span>
        </button>
      </div>

      <button 
        onClick={() => { if(playClick) playClick(); navigate('/dashboard/child'); }}
        className="z-20 mt-12 w-24 hover:-translate-x-2 transition cursor-pointer"
      >
        <img src="/assets/child-mode/BackButton.png" alt="Back" className="w-full drop-shadow-md hover:drop-shadow-xl" />
      </button>
    </div>
  );
}
