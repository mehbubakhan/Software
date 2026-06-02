import React, { useState, useCallback, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// ─── Individual Toast ────────────────────────────────────────────────────────
function Toast({ id, type = 'info', message, onDismiss }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
    error:   <XCircle    className="h-5 w-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
    info:    <Info       className="h-5 w-5 text-cyan-400 shrink-0" />,
  }
  const borders = {
    success: 'border-l-emerald-500',
    error:   'border-l-red-500',
    warning: 'border-l-amber-500',
    info:    'border-l-cyan-500',
  }

  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 4000)
    return () => clearTimeout(t)
  }, [id, onDismiss])

  return (
    <div
      className={`flex items-start gap-3 min-w-[280px] max-w-sm rounded-xl border border-white/10 border-l-4 ${borders[type]} bg-[#1A1D27] px-4 py-3 shadow-2xl shadow-black/40 animate-slide-in`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-200 leading-snug">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 mt-0.5 text-slate-500 hover:text-slate-200 transition"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── Toast Container ─────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}

// ─── useToast Hook ───────────────────────────────────────────────────────────
let _idCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info') => {
    const id = ++_idCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  toast.success = (msg) => toast(msg, 'success')
  toast.error   = (msg) => toast(msg, 'error')
  toast.warning = (msg) => toast(msg, 'warning')
  toast.info    = (msg) => toast(msg, 'info')

  return { toast, toasts, dismiss }
}
