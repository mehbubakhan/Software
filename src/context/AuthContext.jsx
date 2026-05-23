import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [isChildMode, setIsChildMode] = useState(() => {
    return localStorage.getItem('isChildMode') === 'true'
  })

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isChildMode')
    setUser(null)
    setIsChildMode(false)
  }

  const toggleChildMode = (value) => {
    setIsChildMode(value)
    localStorage.setItem('isChildMode', value)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isChildMode, toggleChildMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
