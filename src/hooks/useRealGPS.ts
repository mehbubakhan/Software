import { useState, useEffect } from 'react';


interface LocationData {
  latitude: string | null;
  longitude: string | null;
  accuracy: number | null;
  timestamp: string | null;
}

export function useRealGPS(isActive = true) {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  useEffect(() => {
    let watchId: number;

    if (isActive && 'geolocation' in navigator) {
      setIsTracking(true);
      setError(null);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toLocaleTimeString()
          });
          setError(null);
        },
        (err) => {
          console.error("GPS Error:", err);
          setError(err.message);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else if (!isActive) {
      setIsTracking(false);
      setLocation({ latitude: null, longitude: null, accuracy: null, timestamp: null });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isActive]);

  return { location, error, isTracking };
}
