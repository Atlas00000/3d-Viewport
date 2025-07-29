"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { PanelLeft, PanelRight } from "lucide-react"
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

// Initial scene objects
const initialSceneObjects: SceneObject[] = [
  {
    id: "cube-1",
    name: "Cube",
    type: "box",
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    materialColor: "#3498db",
    roughness: 0.5,
    metalness: 0,
    emissive: "#000000",
    emissiveIntensity: 0,
    opacity: 1,
    wireframe: false,
  },
  {
    id: "sphere-1",
    name: "Sphere",
    type: "sphere",
    position: [2, 0.75, -2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    materialColor: "#e74c3c",
    roughness: 0.2,
    metalness: 0.8,
    emissive: "#000000",
    emissiveIntensity: 0,
    opacity: 1,
    wireframe: false,
  },
  {
    id: "rectangle-1",
    name: "Rectangle",
    type: "box",
    position: [-2, 0.25, 2],
    rotation: [0, 0, 0],
    scale: [1.5, 0.5, 2],
    materialColor: "#2ecc71",
    roughness: 0.7,
    metalness: 0.1,
    emissive: "#000000",
    emissiveIntensity: 0,
    opacity: 1,
    wireframe: false,
  },
]

export default function ThreeDExplorer() {
  const { toast } = useToast()

  // Use our custom hooks
  const { sceneObjects, addObject, updateObject, deleteObject, updateObjectProperty } = useSceneObjects()
  const { selectedObjectId, selectObject, clearSelection } = useObjectSelection()
  const { addToHistory, undo, redo, canUndo, canRedo } = useSceneHistory()
  const { directionalLight, pointLight, updateDirectionalLight, updatePointLight } = useLighting()
  const { resetCamera, getCameraRef } = useCamera()
  
  // Local state
  const [environmentPreset, setEnvironmentPreset] = useState<string>("sunset")
  const [showSidebar, setShowSidebar] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Initialize with default objects only once
  useEffect(() => {
    if (!isInitialized && sceneObjects.length === 0) {
      initialSceneObjects.forEach(obj => addObject(obj))
      setIsInitialized(true)
    }
  }, [addObject, sceneObjects.length, isInitialized])

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
    // Add to history after object creation
    addToHistory([...sceneObjects, newObject])
  }, [addObject, selectObject, sceneObjects, addToHistory])

  const handleAddSphere = useCallback(() => {
    const id = generateId()
    const name = generateName("sphere", sceneObjects.length + 1)
    const newObject = createSphere(id, name)
    addObject(newObject)
    selectObject(id)
    // Add to history after object creation
    addToHistory([...sceneObjects, newObject])
  }, [addObject, selectObject, sceneObjects, addToHistory])

  const handleAddGLTF = useCallback(() => {
    const id = generateId()
    const name = generateName("gltf", sceneObjects.length + 1)
    const newObject = createGLTF(id, name)
    addObject(newObject)
    selectObject(id)
    // Add to history after object creation
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
            // Add to history after object creation
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
      // Add to history after property change
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
    // Add to history after deletion
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
      <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
        {/* Loading overlay for file uploads */}
        {isUploading && (
          <LoadingOverlay text="Uploading model..." />
        )}

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-white bg-opacity-80 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">3D Explorer</h1>
          <nav className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Models
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Settings
                </a>
              </li>
            </ul>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label={showSidebar ? "Hide Control Panel" : "Show Control Panel"}
            >
              {showSidebar ? <PanelLeft className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
            </Button>
          </nav>
        </header>

        {/* Sidebar */}
        <aside
          className={`absolute top-16 left-0 bottom-0 z-10 w-64 p-4 bg-white bg-opacity-80 shadow-md overflow-auto transition-all duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:block`}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Controls</h2>

          {/* Camera Controls */}
          <CameraControls onReset={resetCamera} />

          {/* Scene Controls */}
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

          {/* Lighting Controls */}
          <LightingControls
            environmentPreset={environmentPreset}
            onEnvironmentChange={setEnvironmentPreset}
            directionalLight={directionalLight}
            pointLight={pointLight}
            onDirectionalLightChange={updateDirectionalLight}
            onPointLightChange={updatePointLight}
          />

          {/* Object Properties */}
          <ObjectProperties
            selectedObject={selectedObject}
            onPropertyChange={handleObjectPropertyChange}
            onDeleteObject={handleDeleteObject}
            onClearSelection={clearSelection}
          />
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
      </div>
    </ErrorBoundary>
  )
}
