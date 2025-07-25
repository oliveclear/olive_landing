import { useRef, useState, useCallback, useEffect } from "react";

export function useCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      setError(null);
      setIsActive(true);
      return mediaStream; // Return the stream!
    } catch (err) {
      console.error('Camera error:', err);
      setError(err);
      setIsActive(false);
      throw err;
    }
  }, []);

  // Ensure video element gets the stream when both are ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      // Force the video to play
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Video play failed:', error);
        });
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  return {
    videoRef,
    startCamera,
    stopCamera,
    isActive,
    error,
    stream
  };
}
