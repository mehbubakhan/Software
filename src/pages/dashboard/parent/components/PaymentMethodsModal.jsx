import React, { useState } from 'react';

export default function PaymentMethodsModal({ isOpen, onClose }) {
  const [savedAccounts, setSavedAccounts] = useState({
    bkash: '',
    nagad: '',
    rocket: '',
    dbbl: ''
  });
  
  const [editing, setEditing] = useState(null);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleEdit = (key) => {
    setEditing(key);
    setInputValue(savedAccounts[key]);
  };

  const handleSave = (key) => {
    setSavedAccounts(prev => ({ ...prev, [key]: inputValue }));
    setEditing(null);
  };

  const handleRemove = (key) => {
    setSavedAccounts(prev => ({ ...prev, [key]: '' }));
  };

  const methods = [
    { key: 'bkash', name: 'bKash', short: 'bK', colorClass: 'bg-pink-600', borderClass: 'border-pink-500', buttonHover: 'hover:bg-pink-500' },
    { key: 'nagad', name: 'Nagad', short: 'Ng', colorClass: 'bg-orange-600', borderClass: 'border-orange-500', buttonHover: 'hover:bg-orange-500' },
    { key: 'rocket', name: 'Rocket', short: 'Rk', colorClass: 'bg-purple-600', borderClass: 'border-purple-500', buttonHover: 'hover:bg-purple-500' },
    { key: 'dbbl', name: 'DBBL', short: 'DB', colorClass: 'bg-blue-600', borderClass: 'border-blue-500', buttonHover: 'hover:bg-blue-500' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl w-full max-w-md overflow-hidden flex flex-col p-6 animate-in zoom-in duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-xl flex items-center gap-2"><span>💳</span> Payment Methods</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
        </div>
        
        <div className="space-y-4">
          {methods.map(method => (
            <div 
              key={method.key} 
              className={`p-4 bg-slate-800/50 rounded-xl border transition ${editing === method.key ? method.borderClass : 'border-slate-700 hover:border-slate-600'}`}
            >
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => !editing && !savedAccounts[method.key] && handleEdit(method.key)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${method.colorClass} rounded-full flex items-center justify-center text-white font-bold text-sm`}>{method.short}</div>
                  <div>
                    <span className="font-semibold text-white block">{method.name}</span>
                    {savedAccounts[method.key] && editing !== method.key && (
                      <span className="text-xs text-slate-400">{savedAccounts[method.key]}</span>
                    )}
                  </div>
                </div>
                
                {!editing && !savedAccounts[method.key] && (
                  <span className="text-slate-400 text-sm font-semibold hover:text-white">Add +</span>
                )}
                
                {savedAccounts[method.key] && editing !== method.key && (
                  <div className="flex gap-3">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(method.key); }} className="text-xs font-semibold text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRemove(method.key); }} className="text-xs font-semibold text-red-400 hover:text-red-300">Remove</button>
                  </div>
                )}
              </div>
              
              {editing === method.key && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={`Enter ${method.name} number`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                    autoFocus
                  />
                  <button 
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSave(method.key)}
                    className={`px-4 py-2 ${method.colorClass} ${method.buttonHover} text-white rounded-lg text-sm transition font-semibold`}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
