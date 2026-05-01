import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRedirect(){
  const { user } = useAuth() || {}
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!user) return
    // route by role
    if (user.role === 'parent') navigate('/dashboard/parent')
    else if (user.role === 'admin' || user.role === 'daycare') navigate('/dashboard/admin')
    else if (user.role === 'nanny') navigate('/dashboard/nanny')
    else navigate('/')
  }, [user, navigate])

  return null
}
