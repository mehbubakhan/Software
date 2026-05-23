import React, { useState } from 'react'

const BADGES = [
  { id: 1, name: 'Explorer', icon: '🤠', cost: 100, desc: 'For curious minds' },
  { id: 2, name: 'Star Student', icon: '⭐', cost: 150, desc: 'Perfect scores' },
  { id: 3, name: 'Math Genius', icon: '🧮', cost: 200, desc: 'Number master' },
  { id: 4, name: 'Artist', icon: '🎨', cost: 120, desc: 'Creative drawer' },
  { id: 5, name: 'Bookworm', icon: '📚', cost: 180, desc: 'Loves to read' },
  { id: 6, name: 'Scientist', icon: '🔬', cost: 250, desc: 'Discoverer' },
  { id: 7, name: 'Ninja', icon: '🥷', cost: 300, desc: 'Fast reflexes' },
  { id: 8, name: 'Champion', icon: '🏆', cost: 500, desc: 'Ultimate reward' },
]

export default function RewardsShop({ coins, setCoins, playClick }) {
  const [purchased, setPurchased] = useState(() => {
    const saved = localStorage.getItem('child_purchased_badges')
    return saved ? JSON.parse(saved) : []
  })

  const handlePurchase = (badge) => {
    playClick()
    if (purchased.includes(badge.id)) return
    if (coins >= badge.cost) {
      setCoins(prev => prev - badge.cost)
      const newPurchased = [...purchased, badge.id]
      setPurchased(newPurchased)
      localStorage.setItem('child_purchased_badges', JSON.stringify(newPurchased))
      alert(`You successfully bought the ${badge.name} badge!`)
    } else {
      alert("Oops! You don't have enough coins for this. Play more games to earn coins!")
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-5xl mx-auto mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <div>
          <h2 className="text-3xl font-bold text-amber-600 mb-2">Rewards Shop 🎁</h2>
          <p className="text-amber-700/70 font-medium">Use your earned coins to unlock cool badges!</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-amber-200">
          <span className="text-3xl">🪙</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Balance</span>
            <span className="text-2xl font-black text-amber-600">{coins} Coins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {BADGES.map(badge => {
          const isOwned = purchased.includes(badge.id)
          const canAfford = coins >= badge.cost
          
          return (
            <div key={badge.id} className={`border-2 rounded-2xl p-6 text-center transition ${isOwned ? 'border-amber-400 bg-amber-50' : 'border-slate-100 hover:border-amber-200 hover:shadow-md'}`}>
              <div className="text-6xl mb-4 drop-shadow-sm">{badge.icon}</div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{badge.name}</h3>
              <p className="text-xs text-slate-500 mb-4 h-8">{badge.desc}</p>
              
              <button 
                onClick={() => handlePurchase(badge)}
                disabled={isOwned}
                className={`w-full py-2 rounded-lg font-bold transition ${
                  isOwned 
                  ? 'bg-amber-400 text-white cursor-default' 
                  : canAfford 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer' 
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-70'
                }`}
              >
                {isOwned ? 'Owned ✨' : `🪙 ${badge.cost}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
