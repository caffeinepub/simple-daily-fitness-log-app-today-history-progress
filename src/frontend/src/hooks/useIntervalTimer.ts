import { useState, useRef, useCallback, useEffect } from 'react';

export function useIntervalTimer(durationSeconds: number) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(durationSeconds);

  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now();
    
    intervalRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, pausedTimeRef.current - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 100);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    pausedTimeRef.current = timeRemaining;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning, timeRemaining]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(durationSeconds);
    pausedTimeRef.current = durationSeconds;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [durationSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = ((durationSeconds - timeRemaining) / durationSeconds) * 100;

  return {
    isRunning,
    timeRemaining,
    progress,
    start,
    pause,
    reset,
  };
}
