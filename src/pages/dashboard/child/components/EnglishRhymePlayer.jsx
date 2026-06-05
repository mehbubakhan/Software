import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseLrc } from '../../../../utils/lrcParser';

const RHYMES = [
  { id: 'baa', title: 'Baa Baa Black Sheep', mp3: 'Baa Baa Black Sheep.mp3', lrc: 'Baa Baa Black Sheep.lrc' },
  { id: 'humpty', title: 'Humpty Dumpty', mp3: 'Humpty Dumpty.mp3', lrc: 'Humpty Dumpty.lrc' },
  { id: 'rain', title: 'Rain Rain Go Away', mp3: 'Rain Rain go away.mp3', lrc: 'Rain Rain Go Away.lrc' },
  { id: 'wheels', title: 'The Wheels on the Bus', mp3: 'The wheels On the bus .mp3', lrc: 'The Wheels on the Bus.lrc' },
  { id: 'twinkle', title: 'Twinkle Twinkle Little Star', mp3: 'Twinkle Twinkle Little Star .mp3', lrc: 'Twinkle Twinkle Little Star.lrc' },
];

export default function EnglishRhymePlayer({ playClick }) {
  const navigate = useNavigate();
  
  const [currentRhyme, setCurrentRhyme] = useState(RHYMES[0]);
  const [tokens, setTokens] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  // Load lyrics and audio
  useEffect(() => {
    let active = true;
    const fetchLyrics = async () => {
      try {
        setErrorMsg('');
        const res = await fetch(`/assets/rhymes/${currentRhyme.lrc}`);
        if (!res.ok) throw new Error('Failed to load LRC');
        const text = await res.text();
        if (active) {
          setTokens(parseLrc(text));
          setActiveIndex(-1);
        }
      } catch (e) {
        if (active) {
          setTokens([]);
          setErrorMsg('Lyrics not found.');
        }
      }
    };
    fetchLyrics();

    if (audioRef.current) {
      audioRef.current.src = `/assets/rhymes/${currentRhyme.mp3}`;
      audioRef.current.load();
      setIsPlaying(false);
    }

    return () => { active = false; };
  }, [currentRhyme]);

  const updateHighlight = useCallback(() => {
    if (!audioRef.current || tokens.length === 0) return;
    
    const currentMs = audioRef.current.currentTime * 1000;
    
    let nextActive = -1;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].startMs <= currentMs && currentMs < tokens[i].endMs) {
        nextActive = i;
        break;
      }
    }
    
    // Fallback if we slightly miss the exact window
    if (nextActive === -1) {
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].startMs <= currentMs) {
          nextActive = i;
          break;
        }
      }
    }

    setActiveIndex(nextActive);
    rafRef.current = requestAnimationFrame(updateHighlight);
  }, [tokens]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (playClick) playClick();
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(updateHighlight);
    }).catch(e => console.error("Playback failed:", e));
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    if (playClick) playClick();
    audioRef.current.pause();
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    if (playClick) playClick();
    audioRef.current.currentTime = 0;
    handlePlay();
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };
    if (audio) audio.addEventListener('ended', handleEnded);
    return () => {
      if (audio) audio.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-[700px] w-full rounded-3xl overflow-hidden bg-fuchsia-50 shadow-2xl flex flex-col items-center p-8 border-4 border-white">
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/child-mode/CommonPage.png')" }}
      ></div>

      <div className="z-20 w-full max-w-4xl flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-6 border border-slate-200">
        <button 
          onClick={() => { if(playClick) playClick(); navigate('/dashboard/child/learn/english'); }}
          className="p-2 hover:bg-slate-200 rounded-full transition flex-shrink-0 text-xl font-bold"
        >
          ⬅️ Back
        </button>

        <select 
          value={currentRhyme.id}
          onChange={(e) => {
            if(playClick) playClick();
            setCurrentRhyme(RHYMES.find(r => r.id === e.target.value));
          }}
          className="text-2xl font-black bg-white border-2 border-fuchsia-300 rounded-xl px-4 py-2 text-fuchsia-700 focus:outline-none focus:border-fuchsia-500 shadow-sm"
        >
          {RHYMES.map(r => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </div>

      <h2 className="z-20 text-3xl font-black text-slate-700 mb-6 drop-shadow-sm bg-white/60 px-6 py-2 rounded-full border border-white/50">
        Now Playing: {currentRhyme.title}
      </h2>

      {/* Transport Controls */}
      <div className="z-20 flex gap-4 mb-8">
        <button onClick={handlePlay} disabled={isPlaying} className="disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
          <span className="text-3xl">▶️</span>
        </button>
        <button onClick={handlePause} disabled={!isPlaying} className="disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
          <span className="text-3xl">⏸️</span>
        </button>
        <button onClick={handleReplay} className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
          <span className="text-3xl">🔄</span>
        </button>
      </div>

      <audio ref={audioRef} />

      {/* Lyrics Display */}
      <div className="z-20 flex-1 w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-inner border-4 border-slate-200 p-8 overflow-y-auto">
        {errorMsg ? (
          <p className="text-2xl font-bold text-red-500 text-center mt-10">{errorMsg}</p>
        ) : tokens.length === 0 ? (
          <p className="text-2xl font-bold text-slate-400 text-center mt-10">Loading Lyrics...</p>
        ) : (
          <div className="text-center leading-[4rem]">
            {tokens.map((token, index) => {
              if (token.text === '\n') {
                return <br key={index} />;
              }
              const isActive = index <= activeIndex;
              return (
                <span 
                  key={index}
                  style={{
                    color: isActive ? '#a855f7' : '#ffffff', // purple-500 if active
                    textShadow: isActive ? 'none' : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000', // Stroke logic
                    WebkitTextStroke: isActive ? '2px #000' : '2.5px #000',
                  }}
                  className="text-4xl md:text-[2.5rem] font-black mx-[2px] transition-colors duration-100 ease-linear inline-block"
                >
                  {token.text}
                </span>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
