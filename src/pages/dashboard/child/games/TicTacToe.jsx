import React, { useState } from 'react'

export default function TicTacToe({ playClick, addCoins }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState(null)
  
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i) => {
    if (board[i] || winner) return
    playClick()
    const newBoard = [...board]
    newBoard[i] = xIsNext ? 'X' : 'O'
    setBoard(newBoard)
    
    const win = checkWinner(newBoard)
    if (win) {
      setWinner(win)
      setTimeout(() => {
        addCoins(15)
        alert(`${win} wins! You earned 15 coins!`)
      }, 500)
    } else if (!newBoard.includes(null)) {
      setWinner('Draw')
    } else {
      setXIsNext(!xIsNext)
    }
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setXIsNext(true)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-lg mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-red-500 mb-8">Tic-Tac-Toe ⭕</h2>
      
      <div className="mb-6 flex justify-center gap-8 text-xl font-bold">
        <div className={`px-4 py-2 rounded-lg ${xIsNext && !winner ? 'bg-blue-100 text-blue-600' : 'text-slate-400'}`}>Player X</div>
        <div className={`px-4 py-2 rounded-lg ${!xIsNext && !winner ? 'bg-red-100 text-red-600' : 'text-slate-400'}`}>Player O</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mx-auto w-[240px]">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-slate-50 border-2 border-slate-200 rounded-xl text-5xl font-black flex items-center justify-center hover:bg-slate-100 transition"
          >
            <span className={cell === 'X' ? 'text-blue-500' : 'text-red-500'}>{cell}</span>
          </button>
        ))}
      </div>

      {winner && (
        <div className="mt-8">
          <p className="text-2xl font-bold text-slate-800 mb-4">
            {winner === 'Draw' ? "It's a draw!" : `Winner: ${winner}!`}
          </p>
          <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600">
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
