import React, { useState, useEffect } from 'react'
import { recordGameSession } from '../progressUtils'

const CARDS = ['🍎','🐱','🐶','🐸','🦋','🐞','🚗','🚀']

export default function MemoryGame({ playClick, addCoins }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    // initialize game
    const shuffled = [...CARDS, ...CARDS]
      .sort(() => Math.random() - 0.5)
      .map(id => ({ id: Math.random(), icon: id }))
    setCards(shuffled)
  }, [])

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return
    
    playClick()
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setDisabled(true)
      const [first, second] = newFlipped
      if (cards[first].icon === cards[second].icon) {
        const nextSolved = [...solved, first, second]
        setSolved(nextSolved)
        setFlipped([])
        setDisabled(false)
        if (nextSolved.length === cards.length) {
          setTimeout(() => {
            addCoins(25)
            recordGameSession({ gameId: 'memory', won: true, points: 25 })
            alert("You won the Memory Game! Earned 25 coins!")
          }, 500)
        }
      } else {
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-fuchsia-600 mb-8">Memory Game 🧠</h2>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || solved.includes(idx)
          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-4xl shadow-sm transition-all duration-300 transform ${
                isFlipped ? 'bg-white border-2 border-fuchsia-200 rotate-y-180' : 'bg-fuchsia-500 hover:bg-fuchsia-400'
              }`}
            >
              {isFlipped ? <span>{card.icon}</span> : <span className="text-fuchsia-200 font-black">?</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
