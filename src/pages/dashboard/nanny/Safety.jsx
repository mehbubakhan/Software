import React, { useState } from 'react'
import api from '../../../services/api'

export default function Safety(){
  const [note, setNote] = useState('')
  const submit = async ()=>{
    try{
      await api.post('/safety/respond', { check_id: Date.now(), response: 'ok', note })
      alert('Response recorded')
    }catch(e){ alert('Failed: '+e.message) }
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Safety Check</h3>
      <p className="mb-2">Respond to ongoing safety checks or send a manual confirmation.</p>
      <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Optional note" />
      <div>
        <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded">Confirm OK</button>
      </div>
    </div>
  )
}
