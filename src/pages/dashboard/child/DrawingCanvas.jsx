import React, { useRef, useState, useEffect } from 'react'

export default function DrawingCanvas({ playClick, addCoins }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(5)

  const colors = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.closePath()
      setIsDrawing(false)
    }
  }

  const clearCanvas = () => {
    playClick()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const finishDrawing = () => {
    playClick()
    addCoins(20)
    alert("Beautiful drawing! You earned 20 coins!")
    clearCanvas()
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Coloring Book 🎨</h2>
        <div className="flex gap-4">
          <button onClick={clearCanvas} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200">
            Clear
          </button>
          <button onClick={finishDrawing} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600">
            Done (Get Coins!)
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 items-center">
        <div className="flex gap-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => { playClick(); setColor(c) }}
              className={`w-10 h-10 rounded-full transition transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="font-bold text-slate-500">Brush Size:</span>
          <input 
            type="range" 
            min="1" max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(e.target.value)}
            className="accent-cyan-500"
          />
        </div>
      </div>

      <div className="border-4 border-slate-200 rounded-2xl overflow-hidden bg-white cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full bg-transparent"
        />
      </div>
    </div>
  )
}
