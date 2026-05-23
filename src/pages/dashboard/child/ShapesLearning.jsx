import React from 'react'

const SHAPES = [
  { name: 'Circle', icon: '🔴', color: 'text-red-500' },
  { name: 'Square', icon: '🟦', color: 'text-blue-500' },
  { name: 'Triangle', icon: '🔺', color: 'text-orange-500' },
  { name: 'Star', icon: '⭐', color: 'text-yellow-400' },
  { name: 'Heart', icon: '❤️', color: 'text-pink-500' },
  { name: 'Diamond', icon: '♦️', color: 'text-red-600' },
]

export default function ShapesLearning({ speak, playClick }) {
  const [currentShape, setCurrentShape] = React.useState(SHAPES[0])

  const handleShapeClick = (shape) => {
    playClick()
    setCurrentShape(shape)
    speak(shape.name)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-amber-500 mb-2">Learn Shapes 🔺</h2>
      <p className="text-slate-500 mb-8">Click the shapes to hear their names!</p>

      <div className="flex flex-col items-center justify-center min-h-[300px] mb-12">
        <button 
          onClick={() => { playClick(); speak(currentShape.name) }}
          className="group flex flex-col items-center cursor-pointer hover:scale-105 transition"
        >
          <span className="text-[12rem] leading-none drop-shadow-md transition transform group-hover:-translate-y-4">
            {currentShape.icon}
          </span>
          <span className={`text-4xl font-black mt-8 ${currentShape.color}`}>
            {currentShape.name}
          </span>
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="flex flex-wrap justify-center gap-4">
          {SHAPES.map(shape => (
            <button
              key={shape.name}
              onClick={() => handleShapeClick(shape)}
              className={`p-4 rounded-2xl flex flex-col items-center transition ${
                currentShape.name === shape.name 
                ? 'bg-amber-100 border-2 border-amber-300 scale-110' 
                : 'bg-white border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span className="text-4xl mb-2">{shape.icon}</span>
              <span className="font-bold text-slate-600">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
