import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function GenericTracingCanvas({ 
  moduleType, 
  items, 
  backRoute, 
  playClick, 
  speak, 
  baseFontSize = 320,
  addCoins
}) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tool, setTool] = useState('pencil'); // 'pencil' | 'eraser'
  const [color, setColor] = useState('#3b82f6'); // dodgerblue
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const currentItem = items[currentIndex];

  // Track drawing state
  const isDrawing = useRef(false);
  const maskData = useRef(null);
  
  const drawShapePath = (ctx, shapeType, w, h) => {
    const s = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2;
    ctx.beginPath();
    switch (shapeType.toLowerCase()) {
      case 'circle':
        ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
        break;
      case 'square':
        ctx.rect(cx - s / 2, cy - s / 2, s, s);
        break;
      case 'rectangle':
        ctx.rect(cx - s / 1.5, cy - s / 2, s * 1.33, s);
        break;
      case 'oval':
        ctx.ellipse(cx, cy, s / 1.5, s / 2.5, 0, 0, Math.PI * 2);
        break;
      case 'triangle':
        const th = s * Math.sqrt(3) / 2;
        ctx.moveTo(cx, cy - th / 2);
        ctx.lineTo(cx + s / 2, cy + th / 2);
        ctx.lineTo(cx - s / 2, cy + th / 2);
        ctx.closePath();
        break;
      case 'star':
        const rOuter = s / 2;
        const rInner = rOuter / 2;
        for (let i = 0; i < 10; i++) {
          const angle = Math.PI / 180 * (-90 + i * 36);
          const r = i % 2 === 0 ? rOuter : rInner;
          if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
          else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        break;
      case 'diamond':
        ctx.moveTo(cx, cy - s / 2);
        ctx.lineTo(cx + s / 2, cy);
        ctx.lineTo(cx, cy + s / 2);
        ctx.lineTo(cx - s / 2, cy);
        ctx.closePath();
        break;
      case 'pentagon':
      case 'hexagon':
        const sides = shapeType.toLowerCase() === 'pentagon' ? 5 : 6;
        for (let i = 0; i < sides; i++) {
          const angle = Math.PI / 180 * (-90 + (360 / sides) * i);
          if (i === 0) ctx.moveTo(cx + (s/2) * Math.cos(angle), cy + (s/2) * Math.sin(angle));
          else ctx.lineTo(cx + (s/2) * Math.cos(angle), cy + (s/2) * Math.sin(angle));
        }
        ctx.closePath();
        break;
      case 'trapezoid':
        ctx.moveTo(cx - s * 0.3, cy - s / 2);
        ctx.lineTo(cx + s * 0.3, cy - s / 2);
        ctx.lineTo(cx + s * 0.5, cy + s / 2);
        ctx.lineTo(cx - s * 0.5, cy + s / 2);
        ctx.closePath();
        break;
      case 'parallelogram':
        ctx.moveTo(cx - s * 0.3, cy - s / 2);
        ctx.lineTo(cx + s * 0.5, cy - s / 2);
        ctx.lineTo(cx + s * 0.3, cy + s / 2);
        ctx.lineTo(cx - s * 0.5, cy + s / 2);
        ctx.closePath();
        break;
      case 'right arrow':
      case 'left arrow':
      case 'up arrow':
      case 'down arrow':
        ctx.translate(cx, cy);
        if (shapeType.includes('left')) ctx.rotate(Math.PI);
        if (shapeType.includes('up')) ctx.rotate(-Math.PI / 2);
        if (shapeType.includes('down')) ctx.rotate(Math.PI / 2);
        
        ctx.moveTo(-s*0.4, -s*0.15);
        ctx.lineTo(s*0.1, -s*0.15);
        ctx.lineTo(s*0.1, -s*0.4);
        ctx.lineTo(s*0.5, 0);
        ctx.lineTo(s*0.1, s*0.4);
        ctx.lineTo(s*0.1, s*0.15);
        ctx.lineTo(-s*0.4, s*0.15);
        ctx.closePath();
        
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        break;
      default:
        ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
    }
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentItem) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw Mask
    ctx.fillStyle = '#e2e8f0'; // Base mask color

    let currentFontSize = baseFontSize;

    if (currentItem.type === 'shape') {
      // Draw geometric shape
      drawShapePath(ctx, currentItem.shapeType, canvas.width, canvas.height);
      ctx.fill();
    } else {
      // Draw Text
      ctx.font = `900 ${currentFontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Auto-scale font if it's too wide
      while (ctx.measureText(currentItem.maskText).width > canvas.width - 40 && currentFontSize > 40) {
        currentFontSize -= 10;
        ctx.font = `900 ${currentFontSize}px Arial`;
      }
      
      ctx.fillText(currentItem.maskText, canvas.width / 2, canvas.height / 2);
    }

    // --- Overlay Canvas for Black Border ---
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const oCtx = overlayCanvas.getContext('2d');
      oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      oCtx.strokeStyle = '#000000';
      oCtx.lineWidth = 12;
      oCtx.lineJoin = 'round';
      
      if (currentItem.type === 'shape') {
        drawShapePath(oCtx, currentItem.shapeType, overlayCanvas.width, overlayCanvas.height);
        oCtx.stroke();
      } else {
        oCtx.font = `900 ${currentFontSize}px Arial`;
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        oCtx.strokeText(currentItem.maskText, overlayCanvas.width / 2, overlayCanvas.height / 2);
      }
    }
    // ----------------------------------------
    
    
    maskData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Set composite operation so drawing only happens inside the mask
    ctx.globalCompositeOperation = 'source-atop';
    
    setProgress(0);
    setIsComplete(false);
    setShowPopup(false);
    if (hasFinished.current !== undefined) hasFinished.current = false;
  }, [currentItem, baseFontSize]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || !maskData.current) return;
    const ctx = canvas.getContext('2d');
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    let totalMaskPixels = 0;
    let coloredPixels = 0;

    for (let i = 0; i < maskData.current.data.length; i += 4) {
      if (maskData.current.data[i + 3] > 0) {
        totalMaskPixels++;
        const r = currentData.data[i];
        const g = currentData.data[i + 1];
        const b = currentData.data[i + 2];
        
        if (Math.abs(r - 226) > 10 || Math.abs(g - 232) > 10 || Math.abs(b - 240) > 10) {
          coloredPixels++;
        }
      }
    }

    if (totalMaskPixels > 0) {
      const percentage = Math.min(100, Math.round((coloredPixels / totalMaskPixels) * 100));
      
      if (hasFinished.current) {
        setProgress(100);
      } else {
        setProgress(percentage);
        
        // 96% is a good threshold for "visually full"
        if (percentage >= 96) {
          hasFinished.current = true;
          setProgress(100); // Snap to 100 for UI
          handleCompletion();
        }
      }
    }
  };

  const hasFinished = useRef(false);

  const handleCompletion = () => {
    // 1. Tell the alphabet or word or shape name immediately
    if (currentItem.audioPath) {
      const audio = new Audio(currentItem.audioPath);
      audio.play().catch(e => console.error('Audio play failed:', e));
    } else if (speak && currentItem.speechText) {
      speak(`${currentItem.speechText}`);
    }

    // 2. Wait 2 seconds for the first speech to finish, then say Congratulations
    setTimeout(() => {
      if (speak && currentItem.speechText) {
        speak('Congratulations!');
      }

      // 3. Wait another 1.5 seconds for "Congratulations" to finish before showing the pop-up
      setTimeout(() => {
        setIsComplete(true);
        setShowPopup(true);
        if (addCoins) addCoins(20);

        api.post('/child/progress', {
          module: moduleType,
          current_level: currentItem.level
        }).catch(e => console.error(e));
      }, 1500);
    }, 2000);
  };

  const startDrawing = (e) => {
    if (isComplete) return;
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').beginPath();
    calculateProgress();
  };

  const draw = (e) => {
    if (!isDrawing.current || isComplete) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'eraser') {
      ctx.strokeStyle = '#e2e8f0'; 
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const playVoice = () => {
    if (currentItem.audioPath) {
      const audio = new Audio(currentItem.audioPath);
      audio.play().catch(e => console.error('Audio play failed:', e));
    } else if (speak && currentItem.speechText) {
      speak(`${currentItem.speechText}`);
    }
  };

  const handleNav = (path) => {
    if (playClick) playClick();
    navigate(path);
  };

  if (!currentItem) return null;

  return (
    <div className="relative min-h-[700px] w-full rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col p-6 border-4 border-slate-200">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 z-20 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => handleNav(backRoute)} className="p-2 hover:bg-slate-200 rounded-full transition flex-shrink-0">
            ⬅️ Back
          </button>
          
          <select 
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="text-xl md:text-2xl font-black bg-white border-2 border-slate-300 rounded-xl px-4 py-2 text-slate-700 focus:outline-none focus:border-blue-500 max-w-[200px] md:max-w-[300px]"
          >
            {items.map((item, idx) => (
              <option key={item.id} value={idx}>{item.display}</option>
            ))}
          </select>

          <button 
            onClick={playVoice}
            className="w-12 h-12 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl border-2 border-blue-200 transition-colors shadow-sm"
            title="Play Voice"
          >
            🔊
          </button>
          
          <button 
            onClick={() => { if(playClick) playClick(); initCanvas(); }}
            className="w-12 h-12 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-xl border-2 border-green-200 transition-colors shadow-sm"
            title="Replay / Color Again"
          >
            🔄
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Tools */}
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => setTool('pencil')}
              className={`px-3 py-2 rounded-lg font-bold transition ${tool === 'pencil' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
            >
              ✏️
            </button>
            <button 
              onClick={() => setTool('eraser')}
              className={`px-3 py-2 rounded-lg font-bold transition ${tool === 'eraser' ? 'bg-white shadow text-red-600' : 'text-slate-600'}`}
            >
              🧹
            </button>
          </div>

          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 rounded-xl cursor-pointer"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto mb-6 z-20 flex items-center gap-4">
        <div className="flex-1 bg-slate-200 h-6 rounded-full overflow-hidden border-2 border-slate-300">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xl font-black text-slate-700 min-w-[60px]">{progress}%</span>
      </div>

      {/* Canvas Area */}
      <div 
        className="flex-1 flex items-center justify-center relative bg-cover bg-center rounded-3xl border-4 border-dashed border-slate-300 overflow-hidden"
        style={{ backgroundImage: "url('/assets/child-mode/CommonPage.png')" }}
      >
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
        
        <div className="relative shadow-lg rounded-3xl bg-white/80 overflow-hidden z-10">
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
            onTouchMove={draw}
            className="cursor-crosshair touch-none"
          />
          <canvas
            ref={overlayCanvasRef}
            width={600}
            height={500}
            className="absolute inset-0 pointer-events-none z-20"
          />
        </div>

        {showPopup && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[5px] p-4 font-[Comic_Sans_MS,Comic_Neue,sans-serif]">
            <div className="bg-white border-[6px] border-[#FBBF24] rounded-3xl p-10 w-[90%] max-w-[450px] text-center shadow-[0_20px_0px_rgba(0,0,0,0.1)] animate-in zoom-in duration-500 flex flex-col items-center">
              
              <div className="text-4xl mb-4 animate-bounce">🎉 ✨ 🎈</div>
              
              <div className="text-6xl mb-4 drop-shadow-md">⭐</div>
              
              <h1 className="text-[#FF477E] text-3xl font-black mt-2 mb-4">Woohoo! You Did It!</h1>
              
              <p className="text-slate-600 text-lg leading-relaxed font-medium mb-6">
                Great Job! You colored everything perfectly. You are officially a superstar! 🌟
              </p>
              
              <div className="bg-[#FEF3C7] text-[#D97706] font-bold py-3 px-4 rounded-xl mb-8 inline-flex items-center gap-3">
                <span>+20 Coins</span>
                <span>•</span>
                <span>🏆 Champion Badge</span>
              </div>
              
              <div className="flex justify-center w-full">
                <button 
                  onClick={() => { if(playClick) playClick(); setShowPopup(false); }}
                  className="bg-[#22C55E] text-white border-b-[5px] border-[#15803D] hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-[1px] px-8 py-4 text-xl font-black rounded-2xl transition-all w-full md:w-auto cursor-pointer"
                >
                  Awesome! 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
