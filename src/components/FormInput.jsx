import React from 'react'

export default function FormInput({ label, ...props }){
  return (
    <label className="block mb-3">
      <span className="text-sm text-gray-700">{label}</span>
      <input className="mt-1 block w-full p-2 border rounded" {...props} />
    </label>
  )
}
