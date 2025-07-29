import { useState, useCallback } from 'react'
import { SceneObject } from '@/types/scene'

export const useSceneHistory = () => {
  const [history, setHistory] = useState<SceneObject[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1) // Start at -1 to indicate no history
  
  const addToHistory = useCallback((sceneObjects: SceneObject[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, sceneObjects]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
    }
  }, [historyIndex])
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
    }
  }, [historyIndex, history.length])
  
  const getCurrentState = useCallback(() => {
    return history[historyIndex] || []
  }, [history, historyIndex])
  
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1
  
  return {
    addToHistory,
    undo,
    redo,
    getCurrentState,
    canUndo,
    canRedo,
    historyIndex,
    historyLength: history.length,
  }
} 