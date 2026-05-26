import React, { useState, useEffect } from 'react'

const LEVELS = {
  EASY: {
    size: 5,
    words: ["CAT", "DOG"],
    grid: [
      ['C', 'A', 'T', 'X', 'Y'],
      ['D', 'M', 'N', 'O', 'P'],
      ['O', 'U', 'N', 'A', 'B'],
      ['G', 'Y', 'Z', 'Q', 'R'],
      ['M', 'N', 'P', 'S', 'T']
    ],
    coords: {
      "CAT": ["0-0", "0-1", "0-2"],
      "DOG": ["1-0", "2-0", "3-0"]
    },
    reward: 10
  },
  MEDIUM: {
    size: 6,
    words: ["SUN", "PIG", "BIRD"],
    grid: [
      ['S', 'U', 'N', 'X', 'Y', 'Z'],
      ['P', 'I', 'G', 'O', 'P', 'Q'],
      ['B', 'I', 'R', 'D', 'B', 'C'],
      ['X', 'Y', 'Z', 'D', 'O', 'G'],
      ['M', 'N', 'P', 'Q', 'R', 'S'],
      ['E', 'F', 'G', 'H', 'I', 'J']
    ],
    coords: {
      "SUN": ["0-0", "0-1", "0-2"],
      "PIG": ["1-0", "1-1", "1-2"],
      "BIRD": ["2-0", "2-1", "2-2", "2-3"]
    },
    reward: 15
  },
  HARD: {
    size: 8,
    words: ["APPLE", "TIGER", "WATER"],
    grid: [
      ['A', 'P', 'P', 'L', 'E', 'Z', 'A', 'B'],
      ['T', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
      ['I', 'U', 'N', 'A', 'B', 'C', 'D', 'E'],
      ['G', 'Y', 'Z', 'D', 'O', 'G', 'F', 'G'],
      ['E', 'N', 'W', 'A', 'T', 'E', 'R', 'S'],
      ['R', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
    ],
    coords: {
      "APPLE": ["0-0", "0-1", "0-2", "0-3", "0-4"],
      "TIGER": ["1-0", "2-0", "3-0", "4-0", "5-0"],
      "WATER": ["4-2", "4-3", "4-4", "4-5", "4-6"]
    },
    reward: 25
  }
}

export default function WordSearch({ playClick, addCoins, speak }) {
  const [level, setLevel] = useState('EASY')
  const [selectedCells, setSelectedCells] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [isWon, setIsWon] = useState(false)

  const currentLevel = LEVELS[level]

  useEffect(() => {
    resetGame()
  }, [level])

  const handleCellClick = (r, c) => {
    if (isWon) return
    playClick()

    const cellKey = `${r}-${c}`
    
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
    
    Object.entries(currentLevel.coords).forEach(([word, coords]) => {
      if (!foundWords.includes(word)) {
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

      if (updatedFound.length === currentLevel.words.length) {
        setIsWon(true)
        addCoins(currentLevel.reward)
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
      if (currentLevel.coords[word].includes(cellKey)) return true
    }
    return false
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto text-center mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-500">Word Search 🔍</h2>
        <div className="flex gap-2">
          {['EASY', 'MEDIUM', 'HARD'].map(l => (
            <button
              key={l}
              onClick={() => { playClick(); setLevel(l) }}
              className={`px-4 py-1 rounded-full text-sm font-bold transition ${
                level === l ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-slate-500 mb-6">Find these words: {currentLevel.words.join(', ')}</p>

      {isWon ? (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold text-amber-600 mb-2">You Won!</h3>
          <p className="text-amber-700">You earned {currentLevel.reward} coins!</p>
          <button 
            onClick={resetGame}
            className="mt-6 px-6 py-2 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div 
            className="grid gap-1 sm:gap-2 bg-slate-100 p-3 sm:p-4 rounded-xl"
            style={{ gridTemplateColumns: `repeat(${currentLevel.size}, minmax(0, 1fr))` }}
          >
            {currentLevel.grid.map((row, r) => (
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
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-black rounded-lg cursor-pointer border-b-4 transition-transform hover:scale-105 ${cellColor} ${isFound ? 'cursor-default hover:scale-100' : ''}`}
                  >
                    {letter}
                  </div>
                )
              })
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
        {currentLevel.words.map(word => (
          <div 
            key={word}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-bold border-2 ${
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
