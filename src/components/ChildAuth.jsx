import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ChildAuth({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [actualPin, setActualPin] = useState('1234');

  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const res = await api.get('/family/profile');
          if (res.data?.data?.childModePin) {
            setActualPin(res.data.data.childModePin);
          } else if (res.data?.childModePin) {
            setActualPin(res.data.childModePin);
          }
        } catch (err) {
          console.warn('Failed to load parent profile PIN, using fallback', err);
        }
      };
      loadProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === actualPin) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-100 text-3xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Parent PIN</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your 4-digit Parent PIN to exit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
              autoFocus
            />
            {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-fuchsia-600 py-3 font-semibold text-white shadow-md hover:bg-fuchsia-700 hover:shadow-lg"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
