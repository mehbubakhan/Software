import React from 'react'
import api from '../services/api'

export default function SOSButton(){
  const trigger = async ()=>{
    if(!confirm('Send SOS alert?')) return
    try{
      // try to get location
      navigator.geolocation.getCurrentPosition(async pos =>{
        await api.post('/sos', { lat: pos.coords.latitude, lng: pos.coords.longitude, message: 'SOS triggered' })
        alert('SOS sent')
      }, async () =>{
        await api.post('/sos', { message: 'SOS triggered (no location)' })
        alert('SOS sent (no location)')
      })
    }catch(err){ console.error(err); alert('Failed to send SOS: '+err.message) }
  }
  return (
    <button onClick={trigger} className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg">SOS</button>
  )
}
