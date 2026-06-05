import React, { useEffect, useRef, useState } from 'react';
import { CameraOff } from 'lucide-react';

interface LiveCameraFeedProps {
  className?: string;
}

export function LiveCameraFeed({ className = "" }: LiveCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Prefers rear camera on mobile
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please check permissions.");
      }
    }

    setupCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black/80 text-white ${className}`}>
        <CameraOff size={40} className="mb-2 text-white/50" />
        <p className="text-sm text-center px-4 text-white/70">{error}</p>
      </div>
    );
  }

  return (
    <video 
      ref={videoRef}
      autoPlay 
      playsInline 
      muted 
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
