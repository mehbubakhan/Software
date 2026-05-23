import React, { useState, useEffect } from 'react'

export default function PuzzleGame({ playClick, addCoins, speak }) {
  const [board, setBoard] = useState([])
  const [isWon, setIsWon] = useState(false)

  // 1 through 8, plus empty (0)
  const solvedState = [1, 2, 3, 4, 5, 6, 7, 8, 0]

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // To ensure the puzzle is solvable, it's better to start solved and make random valid moves.
    let currentBoard = [...solvedState]
    
    // Perform random valid moves to shuffle
    let emptyIdx = 8
    for(let i = 0; i < 100; i++) {
      const validMoves = getValidMoves(emptyIdx)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      
      // swap
      currentBoard[emptyIdx] = currentBoard[randomMove]
      currentBoard[randomMove] = 0
      emptyIdx = randomMove
    }
    
    setBoard(currentBoard)
    setIsWon(false)
  }

  const getValidMoves = (emptyIndex) => {
    const row = Math.floor(emptyIndex / 3)
    const col = emptyIndex % 3
    const moves = []

    if (row > 0) moves.push(emptyIndex - 3) // up
    if (row < 2) moves.push(emptyIndex + 3) // down
    if (col > 0) moves.push(emptyIndex - 1) // left
    if (col < 2) moves.push(emptyIndex + 1) // right

    return moves
  }

  const handleTileClick = (index) => {
    if (isWon) return
    
    const emptyIndex = board.indexOf(0)
    const validMoves = getValidMoves(emptyIndex)

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
      addCoins(20)
      if (speak) speak("Puzzle Solved! Great Job!")
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-green-600 mb-2">Puzzle Game 🧩</h2>
      <p className="text-slate-500 mb-8">Slide the tiles to order the numbers 1 to 8!</p>

      {isWon ? (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">You Won!</h3>
          <p className="text-green-700">You earned 20 coins!</p>
          <button 
            onClick={initializeGame}
            className="mt-6 px-6 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="inline-grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-xl mb-8">
          {board.map((tile, index) => (
            <div 
              key={index}
              onClick={() => handleTileClick(index)}
              className={`w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center text-4xl font-black rounded-lg transition-transform ${
                tile === 0 
                  ? 'bg-transparent' 
                  : 'bg-white text-green-500 shadow-sm cursor-pointer hover:scale-[1.02] border-b-4 border-green-100'
              }`}
            >
              {tile !== 0 && tile}
            </div>
          ))}
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
