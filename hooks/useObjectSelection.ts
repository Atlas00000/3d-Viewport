import { useState, useCallback } from 'react'

export const useObjectSelection = () => {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  
  const selectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id)
  }, [])
  
  const clearSelection = useCallback(() => {
    setSelectedObjectId(null)
  }, [])
  
  const toggleSelection = useCallback((id: string) => {
    setSelectedObjectId(prev => prev === id ? null : id)
  }, [])
  
  return {
    selectedObjectId,
    selectObject,
    clearSelection,
    toggleSelection,
  }
} 