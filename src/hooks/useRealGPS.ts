import { useState, useEffect } from 'react';
import api from '../services/api';

interface LocationData {
  latitude: string | null;
  longitude: string | null;
  accuracy: number | null;
  timestamp: string | null;
}

export function useRealGPS(isActive = true, role: 'broadcaster' | 'receiver' = 'broadcaster') {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  const [pathHistory, setPathHistory] = useState<{lat: number, lng: number}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  // Helper to append to history if movement is significant enough to avoid jitter
  const appendHistory = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return;

    setPathHistory(prev => {
      if (prev.length === 0) return [{ lat, lng }];
      const last = prev[prev.length - 1];
      
      // Prevent duplicating exact same coordinates to save memory
      if (last.lat === lat && last.lng === lng) {
        return prev;
      }
      
      return [...prev, { lat, lng }];
    });
  };

  useEffect(() => {
    let watchId: number;
    let pollInterval: NodeJS.Timeout;

    if (!isActive) {
      setIsTracking(false);
      setLocation({ latitude: null, longitude: null, accuracy: null, timestamp: null });
      setPathHistory([]);
      return;
    }

    setIsTracking(true);
    setError(null);

    if (role === 'broadcaster') {
      if ('geolocation' in navigator) {
        const updateLocation = () => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const newLoc = {
                latitude: position.coords.latitude.toFixed(6),
                longitude: position.coords.longitude.toFixed(6),
                accuracy: position.coords.accuracy,
                timestamp: new Date(position.timestamp).toLocaleTimeString()
              };
              setLocation(newLoc);
              appendHistory(newLoc.latitude, newLoc.longitude);
              setError(null);
              
              try {
                await api.post('/gps/update', newLoc);
              } catch (err) {
                console.error("Failed to broadcast GPS:", err);
              }
            },
            (err) => {
              console.error("GPS Error:", err);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        };

        updateLocation();
        pollInterval = setInterval(updateLocation, 3000);
      } else {
        setError("Geolocation not supported");
      }
    } else if (role === 'receiver') {
      const fetchLocation = async () => {
        try {
          const res = await api.get('/gps/live');
          if (res.data && res.data.latitude) {
            setLocation(res.data);
            appendHistory(res.data.latitude, res.data.longitude);
            setError(null);
          }
        } catch (err) {
          console.error("Failed to fetch GPS:", err);
          setError("Failed to sync location");
        }
      };
      
      fetchLocation();
      pollInterval = setInterval(fetchLocation, 3000);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isActive, role]);

  return { location, pathHistory, error, isTracking };
}

