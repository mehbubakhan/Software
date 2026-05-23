import React, { useState, useEffect } from 'react'

const LEVELS = {
  EASY: { size: 3, reward: 20 },
  MEDIUM: { size: 4, reward: 40 },
  HARD: { size: 5, reward: 60 }
}

export default function PuzzleGame({ playClick, addCoins, speak }) {
  const [level, setLevel] = useState('EASY')
  const [board, setBoard] = useState([])
  const [isWon, setIsWon] = useState(false)

  const currentLevel = LEVELS[level]
  const totalTiles = currentLevel.size * currentLevel.size

  // Solved state is 1 to totalTiles-1, with 0 at the end
  const solvedState = Array.from({ length: totalTiles }, (_, i) => i === totalTiles - 1 ? 0 : i + 1)

  useEffect(() => {
    initializeGame()
  }, [level])

  const initializeGame = () => {
    let currentBoard = [...solvedState]
    let emptyIdx = totalTiles - 1
    
    // Shuffle by making random valid moves
    const shuffleMoves = level === 'EASY' ? 50 : level === 'MEDIUM' ? 100 : 150
    for(let i = 0; i < shuffleMoves; i++) {
      const validMoves = getValidMoves(emptyIdx, currentLevel.size)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      currentBoard[emptyIdx] = currentBoard[randomMove]
      currentBoard[randomMove] = 0
      emptyIdx = randomMove
    }
    
    setBoard(currentBoard)
    setIsWon(false)
  }

  const getValidMoves = (emptyIndex, size) => {
    const row = Math.floor(emptyIndex / size)
    const col = emptyIndex % size
    const moves = []

    if (row > 0) moves.push(emptyIndex - size) // up
    if (row < size - 1) moves.push(emptyIndex + size) // down
    if (col > 0) moves.push(emptyIndex - 1) // left
    if (col < size - 1) moves.push(emptyIndex + 1) // right

    return moves
  }

  const handleTileClick = (index) => {
    if (isWon) return
    
    const emptyIndex = board.indexOf(0)
    const validMoves = getValidMoves(emptyIndex, currentLevel.size)

    if (validMoves.includes(index)) {
      playClick()
      const newBoard = [...board]
      newBoard[emptyIndex] = newBoard[index]
      newBoard[index] = 0
      setBoard(newBoard)
      
      checkWin(newBoard)
    }
  }

  const checkWin = (currentBoard) => {
    if (currentBoard.every((val, i) => val === solvedState[i])) {
      setIsWon(true)
      addCoins(currentLevel.reward)
      if (speak) speak("Puzzle Solved! Great Job!")
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-600">Puzzle Game 🧩</h2>
        <div className="flex gap-2">
          {['EASY', 'MEDIUM', 'HARD'].map(l => (
            <button
              key={l}
              onClick={() => { playClick(); setLevel(l) }}
              className={`px-4 py-1 rounded-full text-sm font-bold transition ${
                level === l ? 'bg-green-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <p className="text-slate-500 mb-8">Slide the tiles to order the numbers!</p>

      {isWon ? (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">You Won!</h3>
          <p className="text-green-700">You earned {currentLevel.reward} coins!</p>
          <button 
            onClick={initializeGame}
            className="mt-6 px-6 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div 
            className="grid gap-1 sm:gap-2 bg-slate-200 p-2 sm:p-3 rounded-xl"
            style={{ gridTemplateColumns: `repeat(${currentLevel.size}, minmax(0, 1fr))` }}
          >
            {board.map((tile, index) => {
              // Adjust sizes based on grid
              let sizeClass = "w-20 h-20 sm:w-24 sm:h-24 text-3xl"
              if (level === 'MEDIUM') sizeClass = "w-16 h-16 sm:w-20 sm:h-20 text-2xl"
              if (level === 'HARD') sizeClass = "w-12 h-12 sm:w-16 sm:h-16 text-xl"

              return (
                <div 
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`${sizeClass} flex items-center justify-center font-black rounded-lg transition-transform ${
                    tile === 0 
                      ? 'bg-transparent' 
                      : 'bg-white text-green-500 shadow-sm cursor-pointer hover:scale-[1.02] border-b-4 border-green-100'
                  }`}
                >
                  {tile !== 0 && tile}
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {!isWon && (
        <div>
           <button 
            onClick={initializeGame}
            className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200"
          >
            Shuffle
          </button>
        </div>
      )}
    </div>
  )
}
