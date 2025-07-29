import { useState, useCallback } from 'react'
import { SceneObject } from '@/types/scene'

export const useSceneObjects = () => {
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([])
  
  const addObject = useCallback((object: SceneObject) => {
    setSceneObjects(prev => [...prev, object])
  }, [])
  
  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    setSceneObjects(prev => 
      prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    )
  }, [])
  
  const deleteObject = useCallback((id: string) => {
    setSceneObjects(prev => prev.filter(obj => obj.id !== id))
  }, [])
  
  const updateObjectProperty = useCallback((
    id: string, 
    property: keyof SceneObject, 
    value: any,
    axis?: 0 | 1 | 2
  ) => {
    setSceneObjects(prev => 
      prev.map(obj => {
        if (obj.id !== id) return obj
        
        if (axis !== undefined && ['position', 'rotation', 'scale'].includes(property)) {
          const vectorProperty = obj[property] as [number, number, number]
          const newValue: [number, number, number] = [...vectorProperty]
          newValue[axis] = value as number
          return { ...obj, [property]: newValue }
        }
        
        return { ...obj, [property]: value }
      })
    )
  }, [])
  
  const clearObjects = useCallback(() => {
    setSceneObjects([])
  }, [])
  
  const setObjects = useCallback((objects: SceneObject[]) => {
    setSceneObjects(objects)
  }, [])
  
  return {
    sceneObjects,
    addObject,
    updateObject,
    deleteObject,
    updateObjectProperty,
    clearObjects,
    setObjects,
  }
} 