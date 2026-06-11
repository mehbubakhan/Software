import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Inject CSS for ultra-smooth movement and a glowing colored dot
const customStyles = `
  /* Ultra-smooth sliding transition */
  .leaflet-marker-icon {
    transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  /* Colored glowing dot instead of default pin */
  .glowing-dot {
    background-color: #db2777; /* Fuchsia */
    width: 20px !important;
    height: 20px !important;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 15px rgba(219, 39, 119, 0.8), 0 0 5px rgba(219, 39, 119, 0.5);
    margin-top: -10px !important;
    margin-left: -10px !important;
  }
  
  /* Pulsing animation around the dot */
  .glowing-dot::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    border: 2px solid #db2777;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
`;

// Create the custom colored DivIcon
const customIcon = L.divIcon({
  className: 'glowing-dot',
  iconSize: [20, 20],
});

// Component to dynamically recenter the map when the live marker moves
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true, duration: 1.2 });
  }, [lat, lng, map]);
  return null;
};

export default function LiveMap({ currentLat, currentLng, pathHistory }) {
  if (!currentLat || !currentLng) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mb-2"></div>
        <p className="text-slate-500">Loading map...</p>
      </div>
    );
  }

  const lat = parseFloat(currentLat);
  const lng = parseFloat(currentLng);
  const positions = pathHistory.map(p => [p.lat, p.lng]);

  return (
    <div className="w-full h-full relative z-0">
      <style>{customStyles}</style>
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {positions.length > 1 && (
          <Polyline positions={positions} color="#db2777" weight={5} opacity={0.7} />
        )}

        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>Live Location</Popup>
        </Marker>

        <MapRecenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

