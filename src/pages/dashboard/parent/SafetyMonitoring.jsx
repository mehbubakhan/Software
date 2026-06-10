import React, { useState, useEffect } from 'react'
import api from '../../../services/api'
import { useRealGPS } from '../../../hooks/useRealGPS'

import LiveMap from './LiveMap'

export default function SafetyMonitoring() {
  const [activeTab, setActiveTab] = useState('gps')
  const { location: realLocation, pathHistory, error: gpsError, isTracking } = useRealGPS(activeTab === 'gps', 'receiver')

  const [childLocation, setChildLocation] = useState({
    name: 'Emma',
    latitude: 40.7128,
    longitude: -74.0060,
    lastUpdate: '2 mins ago',
    status: 'At Daycare',
    safeZones: ['Home', 'Daycare', 'School']
  })

  const [nannyLocation, setNannyLocation] = useState({
    name: 'Sarah (Nanny)',
    latitude: 40.7150,
    longitude: -74.0080,
    lastUpdate: 'Just now',
    status: 'On the way to park',
    battery: '85%'
  })

  const [trackingTarget, setTrackingTarget] = useState('child')

  // Override static coordinates with real GPS if tracking is active
  const currentTarget = trackingTarget === 'child' ? childLocation : nannyLocation;
  const displayLat = realLocation.latitude || currentTarget.latitude;
  const displayLng = realLocation.longitude || currentTarget.longitude;
  const displayTime = realLocation.timestamp || currentTarget.lastUpdate;
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info', message: 'Child arrived at daycare', time: '09:15 AM' },
    { id: 2, type: 'warning', message: 'Child left geofence zone', time: '02:30 PM' },
    { id: 3, type: 'success', message: 'Child arrived home', time: '05:45 PM' }
  ])
  const [showSOSConfirm, setShowSOSConfirm] = useState(false)

  const handleSOS = async () => {
    try {
      await api.post('/safety/emergency-sos', {
        childId: 1,
        location: childLocation,
        timestamp: new Date()
      })
      alert('Emergency SOS activated! Authorities and emergency contacts notified.')
      setShowSOSConfirm(false)
    } catch (error) {
      console.error('Error sending SOS:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Child Safety Monitoring</h1>
        <p className="text-slate-600 mt-2">Real-time GPS tracking and safety alerts</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('gps')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'gps'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📍 GPS Tracking
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'alerts'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🚨 Alerts & History
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'zones'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🗺️ Safe Zones
        </button>
      </div>

      {/* GPS Tracking Tab */}
      {activeTab === 'gps' && (
        <div className="space-y-6">
          {/* Target Selector */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTrackingTarget('child')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${
                trackingTarget === 'child' 
                  ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-fuchsia-300'
              }`}
            >
              👧 Track Child
            </button>
            <button
              onClick={() => setTrackingTarget('nanny')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${
                trackingTarget === 'nanny' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              👩‍🦰 Track Nanny
            </button>
          </div>

          {/* Smooth Leaflet Map */}
          <div className="border-2 border-slate-200 rounded-lg h-80 relative overflow-hidden bg-slate-100 z-0">
            <LiveMap 
              currentLat={displayLat} 
              currentLng={displayLng} 
              pathHistory={pathHistory || []} 
            />
            
            {/* Overlay Status Bubble */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
              {gpsError ? (
                <p className="text-red-500 font-bold text-sm">{gpsError}</p>
              ) : (
                <div className="flex items-center gap-2">
                  {isTracking ? <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> : <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>}
                  <span className="text-sm font-bold text-slate-700">
                    {isTracking ? 'Active Connection' : 'Offline / Static'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {trackingTarget === 'child' ? '👧' : '👩‍🦰'} {currentTarget.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${trackingTarget === 'child' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-blue-100 text-blue-700'}`}>
                {trackingTarget.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Status</p>
                <p className="text-lg font-bold text-green-600">✓ {currentTarget.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-semibold">Latitude</p>
                <p className="text-lg font-bold text-slate-900">{displayLat}°</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-semibold">Longitude</p>
                <p className="text-lg font-bold text-slate-900">{displayLng}°</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-semibold">Last Update</p>
                <p className="text-lg font-bold text-slate-900">{displayTime}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-sm text-slate-500 font-semibold">Signal Strength</p>
                <p className="text-lg font-bold text-blue-600">📶 Strong</p>
              </div>
              {trackingTarget === 'nanny' && currentTarget.battery && (
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-slate-500 font-semibold">Nanny Device Battery</p>
                  <p className="text-lg font-bold text-emerald-600">🔋 {currentTarget.battery}</p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency SOS Button */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-4">🚨 Emergency Features</h3>
            <button
              onClick={() => setShowSOSConfirm(true)}
              className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-lg"
            >
              🚨 TRIGGER EMERGENCY SOS
            </button>
            <p className="text-sm text-red-600 mt-2">
              This will immediately alert emergency contacts and authorities with live location
            </p>
          </div>
        </div>
      )}

      {/* Alerts & History Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Alert History</h3>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'info'
                  ? 'bg-blue-50 border-blue-400'
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-green-50 border-green-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{alert.message}</p>
                <span className="text-sm text-slate-600">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safe Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Configured Safe Zones</h3>
          <div className="space-y-2">
            {childLocation.safeZones.map((zone, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="font-semibold text-slate-900">{zone}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
            ))}
          </div>

          <button className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold">
            ➕ Add New Safe Zone
          </button>
        </div>
      )}

      {/* SOS Confirmation Modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Emergency SOS Confirmation</h2>
            <p className="text-slate-600 mb-6">
              Are you sure? This will immediately trigger emergency alerts to:
            </p>
            <ul className="space-y-2 mb-6 text-slate-600">
              <li>✓ Emergency contacts</li>
              <li>✓ Local authorities</li>
              <li>✓ Daycare/Nanny</li>
              <li>✓ Admin support</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSOSConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSOS}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Yes, Send SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
