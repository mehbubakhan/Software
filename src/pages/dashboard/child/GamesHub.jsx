import React from 'react'
import { Link } from 'react-router-dom'

export default function GamesHub({ playClick }) {
  const games = [
    { name: 'Memory Game', icon: '🧠', color: 'bg-fuchsia-500', path: '/dashboard/child/games/memory' },
    { name: 'Puzzle Game', icon: '🧩', color: 'bg-green-500', path: '#' },
    { name: 'Shape Match', icon: '🔺', color: 'bg-blue-500', path: '/dashboard/child/shapes' },
    { name: 'Tic-Tac-Toe', icon: '⭕', color: 'bg-red-500', path: '/dashboard/child/games/tictactoe' },
    { name: 'Word Search', icon: '🔍', color: 'bg-amber-500', path: '#' },
    { name: 'Coloring Book', icon: '🎨', color: 'bg-cyan-500', path: '/dashboard/child/draw' },
  ]

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-5xl mx-auto text-center mt-12">
      <h2 className="text-4xl font-bold text-slate-800 mb-2">Games 🎮</h2>
      <p className="text-slate-500 mb-12">Choose a game to play and earn coins!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map(game => (
          <Link
            key={game.name}
            to={game.path}
            onClick={playClick}
            className={`${game.color} rounded-2xl p-6 text-white transition hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center min-h-[160px]`}
          >
            <span className="text-5xl mb-3 drop-shadow-md">{game.icon}</span>
            <span className="text-xl font-bold">{game.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
