import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="p-8 bg-daycare min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Daycare Management</h1>
        <p className="mb-6">A simple demo frontend for daycare operations.</p>
        <div className="space-x-3">
          <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</Link>
          <Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded">Signup</Link>
        </div>
      </div>
    </div>
  )
}
