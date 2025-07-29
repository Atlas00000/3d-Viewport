import { useState, useCallback } from 'react'
import { DirectionalLightState, LightState } from '@/types/scene'

export const useLighting = () => {
  const [directionalLight, setDirectionalLight] = useState<DirectionalLightState>({
    color: "#ffffff",
    intensity: 1,
    position: [5, 5, 5],
    castShadow: true,
    shadowMapSize: [1024, 1024],
    shadowBias: -0.0005,
  })

  const [pointLight, setPointLight] = useState<LightState>({
    color: "#ffffff",
    intensity: 0.5,
    position: [-5, 5, -5],
  })

  const updateDirectionalLight = useCallback((
    property: keyof DirectionalLightState,
    value: any,
    axis?: 0 | 1 | 2
  ) => {
    setDirectionalLight(prev => {
      if (property === "position" && axis !== undefined) {
        const newPos: [number, number, number] = [...prev.position]
        newPos[axis] = value as number
        return { ...prev, position: newPos }
      }
      if (property === "shadowMapSize") {
        return { ...prev, shadowMapSize: [value, value] }
      }
      return { ...prev, [property]: value }
    })
  }, [])

  const updatePointLight = useCallback((
    property: keyof LightState,
    value: any,
    axis?: 0 | 1 | 2
  ) => {
    setPointLight(prev => {
      if (property === "position" && axis !== undefined) {
        const newPos: [number, number, number] = [...prev.position]
        newPos[axis] = value as number
        return { ...prev, position: newPos }
      }
      return { ...prev, [property]: value }
    })
  }, [])

  return {
    directionalLight,
    pointLight,
    updateDirectionalLight,
    updatePointLight,
  }
} 