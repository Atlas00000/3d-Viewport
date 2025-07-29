import { useRef, useCallback } from 'react'

export const useCamera = () => {
  const orbitControlsRef = useRef<any>(null)
  
  const resetCamera = useCallback(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset()
    }
  }, [])
  
  const getCameraRef = useCallback(() => orbitControlsRef, [])
  
  return {
    resetCamera,
    getCameraRef,
  }
} 