import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '../components/Toast'

const ToastContext = createContext()

let _idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info') => {
    const id = ++_idCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const success = useCallback((msg) => toast(msg, 'success'), [toast])
  const error = useCallback((msg) => toast(msg, 'error'), [toast])
  const warning = useCallback((msg) => toast(msg, 'warning'), [toast])
  const info = useCallback((msg) => toast(msg, 'info'), [toast])

  const api = React.useMemo(() => ({
    success,
    error,
    warning,
    info
  }), [success, error, warning, info])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
