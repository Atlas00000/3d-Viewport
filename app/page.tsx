"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { PanelLeft, PanelRight, TreePine, PawPrint, Volume2, VolumeX, Sun, Moon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { LoadingOverlay } from "@/components/ui/loading"

// Import our custom hooks
import { useSceneObjects } from "@/hooks/useSceneObjects"
import { useObjectSelection } from "@/hooks/useObjectSelection"
import { useSceneHistory } from "@/hooks/useSceneHistory"
import { useLighting } from "@/hooks/useLighting"
import { useCamera } from "@/hooks/useCamera"

// Import our modular components
import { SceneViewport } from "@/components/scene/SceneViewport"
import { SceneControls } from "@/components/scene/SceneControls"
import { ObjectProperties } from "@/components/scene/ObjectProperties"
import { LightingControls } from "@/components/scene/LightingControls"
import { CameraControls } from "@/components/scene/CameraControls"

// Import utilities
import { createBox, createSphere, createGLTF, generateId, generateName } from "@/utils/objectFactory"
import { SceneObject } from "@/types/scene"
import { FloatingDataPanel } from "@/components/ui/floating-data-panel"
import { polarBearData } from "@/data/polar-bear-data"

// Initial scene objects - empty to start with a clean scene
const initialSceneObjects: SceneObject[] = []

export default function JungleQuest() {
  const { toast } = useToast()

  // Use our custom hooks
  const { sceneObjects, addObject, updateObject, deleteObject, updateObjectProperty } = useSceneObjects()
  const { selectedObjectId, selectObject, clearSelection } = useObjectSelection()
  const { addToHistory, undo, redo, canUndo, canRedo } = useSceneHistory()
  const { directionalLight, pointLight, updateDirectionalLight, updatePointLight } = useLighting()
  const { resetCamera, getCameraRef } = useCamera()
  
  // Local state
  const [environmentPreset, setEnvironmentPreset] = useState<string>("sunset")
  const [showSidebar, setShowSidebar] = useState(false) // Temporarily disabled for admin use
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [theme, setTheme] = useState<'day' | 'night'>('day')


  // Initialize scene state only once
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Get selected object
  const selectedObject = useMemo(
    () => sceneObjects.find((obj) => obj.id === selectedObjectId) || null,
    [selectedObjectId, sceneObjects],
  )

  // Object creation handlers
  const handleAddBox = useCallback(() => {
    const id = generateId()
    const name = generateName("box", sceneObjects.length + 1)
    const newObject = createBox(id, name)
    addObject(newObject)
    selectObject(id)
    addToHistory([...sceneObjects, newObject])
  }, [addObject, selectObject, sceneObjects, addToHistory])

  const handleAddSphere = useCallback(() => {
    const id = generateId()
    const name = generateName("sphere", sceneObjects.length + 1)
    const newObject = createSphere(id, name)
    addObject(newObject)
    selectObject(id)
    addToHistory([...sceneObjects, newObject])
  }, [addObject, selectObject, sceneObjects, addToHistory])

  const handleAddGLTF = useCallback(() => {
    const id = generateId()
    const name = generateName("gltf", sceneObjects.length + 1)
    const newObject = createGLTF(id, name)
    addObject(newObject)
    selectObject(id)
    addToHistory([...sceneObjects, newObject])
  }, [addObject, selectObject, sceneObjects, addToHistory])

  // File upload handler
  const handleModelUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
          toast({
            title: "Invalid file type",
            description: "Please upload a .glb or .gltf file.",
            variant: "destructive",
          })
          return
        }

        setIsUploading(true)
        const reader = new FileReader()
        
        reader.onload = (e) => {
          if (e.target?.result) {
            const blob = new Blob([e.target.result], { type: file.type })
            const objectURL = URL.createObjectURL(blob)
            const id = generateId()
            const name = file.name.split(".")[0] || generateName("gltf", sceneObjects.length + 1)
            const newObject = createGLTF(id, name, objectURL)
            addObject(newObject)
            selectObject(id)
            addToHistory([...sceneObjects, newObject])
            toast({
              title: "Model Uploaded",
              description: `"${file.name}" added to scene.`,
            })
          }
          setIsUploading(false)
        }
        
        reader.onerror = () => {
          toast({
            title: "Upload Failed",
            description: "Could not read the file.",
            variant: "destructive",
          })
          setIsUploading(false)
        }
        
        reader.readAsArrayBuffer(file)
      }
    },
    [addObject, selectObject, sceneObjects, addToHistory, toast],
  )

  // Object property change handler
  const handleObjectPropertyChange = useCallback(
    (property: keyof SceneObject, value: any, axis?: 0 | 1 | 2) => {
      if (!selectedObject) return
      updateObjectProperty(selectedObject.id, property, value, axis)
      const updatedObjects = sceneObjects.map(obj => 
        obj.id === selectedObject.id 
          ? { ...obj, [property]: axis !== undefined && ['position', 'rotation', 'scale'].includes(property)
              ? (() => {
                  const newValue = [...obj[property as keyof SceneObject]] as [number, number, number]
                  newValue[axis] = value
                  return newValue
                })()
              : value
            }
          : obj
      )
      addToHistory(updatedObjects)
    },
    [selectedObject, updateObjectProperty, sceneObjects, addToHistory],
  )

  // Object deletion handler
  const handleDeleteObject = useCallback(() => {
    if (!selectedObject) return
    deleteObject(selectedObject.id)
    clearSelection()
    const updatedObjects = sceneObjects.filter(obj => obj.id !== selectedObject.id)
    addToHistory(updatedObjects)
    toast({
      title: "Object Deleted",
      description: `"${selectedObject.name}" has been removed.`,
    })
  }, [selectedObject, deleteObject, clearSelection, sceneObjects, addToHistory, toast])

  // Cleanup object URLs when components unmount
  useEffect(() => {
    return () => {
      sceneObjects.forEach((obj) => {
        if (obj.type === "gltf" && obj.modelPath?.startsWith("blob:")) {
          URL.revokeObjectURL(obj.modelPath)
        }
      })
    }
  }, [sceneObjects])

  return (
    <ErrorBoundary>
      <div className={`relative w-full h-screen overflow-hidden transition-all duration-500 ${
        theme === 'day' 
          ? 'jungle-gradient leaf-pattern' 
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      }`}>
        {/* Loading overlay for file uploads */}
        {isUploading && (
          <LoadingOverlay text="Uploading model..." />
        )}

        {/* Jungle-themed Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-r from-green-800/90 via-green-700/90 to-green-600/90 backdrop-blur-sm border-b-2 border-green-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-300 animate-pulse" />
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  <span className="text-yellow-300">Jungle</span>
                  <span className="text-green-300">Quest</span>
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-4 ml-6">
                <span className="text-green-200 text-sm">🐾 3D Animal Explorer</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="jungle-button text-white hover:bg-green-600/50"
                aria-label={soundEnabled ? "Disable Sound" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'day' ? 'night' : 'day')}
                className="jungle-button text-white hover:bg-green-600/50"
                aria-label={theme === 'day' ? "Switch to Night Mode" : "Switch to Day Mode"}
              >
                {theme === 'day' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              
              {/* Sidebar Toggle - Temporarily disabled for admin use
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="jungle-button text-white hover:bg-green-600/50"
                aria-label={showSidebar ? "Hide Control Panel" : "Show Control Panel"}
              >
                {showSidebar ? <PanelLeft className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
              </Button>
              */}
            </div>
          </div>
        </header>

        {/* Jungle-themed Sidebar */}
        <aside
          className={`absolute top-20 left-0 bottom-0 z-10 w-72 p-4 bg-gradient-to-b from-green-100/95 via-green-50/95 to-green-100/95 backdrop-blur-sm border-r-2 border-green-300/50 overflow-auto transition-all duration-500 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:block jungle-shadow`}
        >
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center p-4 bg-gradient-to-r from-green-200 to-yellow-200 rounded-xl border-2 border-green-300">
              <Sparkles className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-green-800">Welcome to JungleQuest!</h2>
              <p className="text-sm text-green-700 mt-1">Explore amazing animals in 3D! 🦁🐘🦜</p>
            </div>

            {/* Camera Controls */}
            <div className="bg-white/80 rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <PawPrint className="h-5 w-5 mr-2" />
                Camera Controls
              </h3>
              <CameraControls onReset={resetCamera} />
            </div>

            {/* Scene Controls */}
            <div className="bg-white/80 rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <TreePine className="h-5 w-5 mr-2" />
                Scene Tools
              </h3>
              <SceneControls
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onAddBox={handleAddBox}
                onAddSphere={handleAddSphere}
                onAddGLTF={handleAddGLTF}
                onModelUpload={handleModelUpload}
              />
            </div>

            {/* Lighting Controls */}
            <div className="bg-white/80 rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <Sun className="h-5 w-5 mr-2" />
                Lighting & Environment
              </h3>
              <LightingControls
                environmentPreset={environmentPreset}
                onEnvironmentChange={setEnvironmentPreset}
                directionalLight={directionalLight}
                pointLight={pointLight}
                onDirectionalLightChange={updateDirectionalLight}
                onPointLightChange={updatePointLight}
              />
            </div>

            {/* Object Properties */}
            <div className="bg-white/80 rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Object Properties
              </h3>
              <ObjectProperties
                selectedObject={selectedObject}
                onPropertyChange={handleObjectPropertyChange}
                onDeleteObject={handleDeleteObject}
                onClearSelection={clearSelection}
              />
            </div>
          </div>
        </aside>

        {/* 3D Viewport */}
        <SceneViewport
          sceneObjects={sceneObjects}
          selectedObjectId={selectedObjectId}
          onObjectSelect={selectObject}
          directionalLight={directionalLight}
          pointLight={pointLight}
          environmentPreset={environmentPreset}
          showSidebar={showSidebar}
          orbitControlsRef={getCameraRef()}
        />

        {/* Floating Data Panel */}
        <FloatingDataPanel animal={polarBearData} />
      </div>
    </ErrorBoundary>
  )
}
