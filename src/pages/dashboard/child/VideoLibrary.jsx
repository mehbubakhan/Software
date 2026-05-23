import React, { useState } from 'react'

const VIDEOS = [
  { id: 1, title: 'ABC Song', cat: 'ABC Video', icon: '🔤', color: 'bg-blue-500' },
  { id: 2, title: '123 Rhymes', cat: 'Math Rhymes', icon: '🔢', color: 'bg-pink-500' },
  { id: 3, title: 'Shape Sorter', cat: 'Logic Thinking', icon: '🧠', color: 'bg-green-500' },
  { id: 4, title: 'Please & Thank You', cat: 'Etiquette', icon: '🤝', color: 'bg-amber-500' },
  { id: 5, title: 'Hello in Sign', cat: 'Sign Language', icon: '👋', color: 'bg-purple-500' },
]

export default function VideoLibrary({ playClick, addCoins }) {
  const [activeVideo, setActiveVideo] = useState(null)

  const handleWatch = (vid) => {
    playClick()
    setActiveVideo(vid)
  }

  const closeVideo = () => {
    playClick()
    addCoins(5)
    alert("Video finished! You earned 5 coins!")
    setActiveVideo(null)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-5xl mx-auto text-center mt-12 relative">
      <h2 className="text-4xl font-bold text-slate-800 mb-2">Educational Videos 📺</h2>
      <p className="text-slate-500 mb-12">Watch and learn new things!</p>

      {/* Video Categories Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {VIDEOS.map(v => (
          <button 
            key={v.id}
            onClick={() => handleWatch(v)}
            className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-100 hover:-translate-y-1 transition font-bold text-slate-600"
          >
            <span>{v.icon}</span> {v.cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {VIDEOS.map(vid => (
          <div key={vid.id} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:shadow-lg transition flex flex-col">
            <div className={`${vid.color} w-full aspect-video rounded-xl flex items-center justify-center text-5xl text-white mb-4 shadow-inner relative group cursor-pointer`} onClick={() => handleWatch(vid)}>
              {vid.icon}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-xl">
                <span className="text-6xl text-white drop-shadow-lg">▶️</span>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">{vid.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{vid.cat}</p>
            <button onClick={() => handleWatch(vid)} className="mt-auto w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">
              Watch Now
            </button>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">{activeVideo.title}</h3>
              <button onClick={closeVideo} className="text-slate-400 hover:text-white transition bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">✕</button>
            </div>
            <div className={`${activeVideo.color} aspect-video flex flex-col items-center justify-center relative`}>
              <span className="text-9xl mb-4 animate-bounce">{activeVideo.icon}</span>
              <p className="text-white/80 font-bold text-2xl tracking-widest uppercase">Video Playing...</p>
              
              <div className="absolute bottom-4 left-4 right-4 bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-1/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
