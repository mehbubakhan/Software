import React, { useState } from 'react'

const GRID_SIZE = 6
const WORDS_TO_FIND = ["CAT", "DOG", "SUN"]

const INITIAL_GRID = [
  ['C', 'A', 'T', 'X', 'Y', 'Z'],
  ['L', 'M', 'N', 'O', 'P', 'Q'],
  ['S', 'U', 'N', 'A', 'B', 'C'],
  ['X', 'Y', 'Z', 'D', 'O', 'G'],
  ['M', 'N', 'P', 'Q', 'R', 'S'],
  ['E', 'F', 'G', 'H', 'I', 'J']
]

// The coordinates of the actual words
const WORD_COORDS = {
  "CAT": ["0-0", "0-1", "0-2"],
  "SUN": ["2-0", "2-1", "2-2"],
  "DOG": ["3-3", "3-4", "3-5"]
}

export default function WordSearch({ playClick, addCoins, speak }) {
  const [selectedCells, setSelectedCells] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [isWon, setIsWon] = useState(false)

  const handleCellClick = (r, c) => {
    if (isWon) return
    playClick()

    const cellKey = `${r}-${c}`
    
    // Toggle selection
    let newSelected = [...selectedCells]
    if (newSelected.includes(cellKey)) {
      newSelected = newSelected.filter(k => k !== cellKey)
    } else {
      newSelected.push(cellKey)
    }

    setSelectedCells(newSelected)
    checkWords(newSelected)
  }

  const checkWords = (currentSelected) => {
    let newlyFound = []
    
    Object.entries(WORD_COORDS).forEach(([word, coords]) => {
      if (!foundWords.includes(word)) {
        // Check if all coords for this word are in currentSelected
        const isFound = coords.every(c => currentSelected.includes(c))
        if (isFound) {
          newlyFound.push(word)
        }
      }
    })

    if (newlyFound.length > 0) {
      const updatedFound = [...foundWords, ...newlyFound]
      setFoundWords(updatedFound)
      
      if (speak) {
        speak(`You found ${newlyFound.join(' and ')}!`)
      }

      if (updatedFound.length === WORDS_TO_FIND.length) {
        setIsWon(true)
        addCoins(15)
        setTimeout(() => {
          if (speak) speak("You found all the words! Awesome!")
        }, 1500)
      }
    }
  }

  const resetGame = () => {
    setSelectedCells([])
    setFoundWords([])
    setIsWon(false)
  }

  const isCellFound = (cellKey) => {
    for (let word of foundWords) {
      if (WORD_COORDS[word].includes(cellKey)) return true
    }
    return false
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-amber-500 mb-2">Word Search 🔍</h2>
      <p className="text-slate-500 mb-6">Find these words: {WORDS_TO_FIND.join(', ')}</p>

      {isWon ? (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold text-amber-600 mb-2">You Won!</h3>
          <p className="text-amber-700">You earned 15 coins!</p>
          <button 
            onClick={resetGame}
            className="mt-6 px-6 py-2 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="grid grid-cols-6 gap-2 bg-slate-100 p-4 rounded-xl">
            {INITIAL_GRID.map((row, r) => (
              row.map((letter, c) => {
                const cellKey = `${r}-${c}`
                const isFound = isCellFound(cellKey)
                const isSelected = selectedCells.includes(cellKey)
                
                let cellColor = 'bg-white text-slate-700'
                if (isFound) {
                  cellColor = 'bg-green-400 text-white border-green-500'
                } else if (isSelected) {
                  cellColor = 'bg-amber-300 text-amber-900 border-amber-400'
                }

                return (
                  <div
                    key={cellKey}
                    onClick={() => !isFound && handleCellClick(r, c)}
                    className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-black rounded-lg cursor-pointer border-b-4 transition-transform hover:scale-105 ${cellColor} ${isFound ? 'cursor-default hover:scale-100' : ''}`}
                  >
                    {letter}
                  </div>
                )
              })
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {WORDS_TO_FIND.map(word => (
          <div 
            key={word}
            className={`px-4 py-2 rounded-full font-bold border-2 ${
              foundWords.includes(word) 
                ? 'bg-green-100 border-green-200 text-green-600 line-through' 
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            {word}
          </div>
        ))}
      </div>

    </div>
  )
}
