"use client"

import type React from "react"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Box, Sphere, Plane, Grid } from "@react-three/drei"
import { SelectableWrapper } from "@/components/selectable-wrapper"
import { GLTFModel } from "@/components/gltf-model"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { PanelLeft, PanelRight } from "lucide-react" // Import icons

// Helper component for the Camera Reset Button
interface CameraControlsButtonProps {
  onReset: () => void
}

function CameraResetButton({ onReset }: CameraControlsButtonProps) {
  return (
    <Button onClick={onReset} className="w-full mt-2">
      Reset Camera
    </Button>
  )
}

interface SceneObject {
  id: string
  name: string
  type: "box" | "sphere" | "gltf"
  modelPath?: string // Optional path for GLTF models (can be blob URL or static path)
  position: [number, number, number]
  rotation: [number, number, number] // Radians
  scale: [number, number, number]
  // Material properties (primarily for box/sphere, GLTF will use displayColor)
  materialColor: string
  roughness: number
  metalness: number
  emissive: string
  emissiveIntensity: number
  opacity: number
  wireframe: boolean
}

interface LightState {
  color: string
  intensity: number
  position: [number, number, number]
}

interface DirectionalLightState extends LightState {
  castShadow: boolean
  shadowMapSize: [number, number]
  shadowBias: number
}

const initialSceneObjects: SceneObject[] = [
  {
    id: "cube-1",
    name: "Cube",
    type: "box",
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    materialColor: "#3498db", // Blue
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
    materialColor: "#e74c3c", // Red
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
    materialColor: "#2ecc71", // Green
    roughness: 0.7,
    metalness: 0.1,
    emissive: "#000000",
    emissiveIntensity: 0,
    opacity: 1,
    wireframe: false,
  },
]

export default function ThreeDExplorer() {
  const orbitControlsRef = useRef<any>(null)
  const { toast } = useToast()

  // History for undo/redo
  const [history, setHistory] = useState<SceneObject[][]>([initialSceneObjects])
  const [historyIndex, setHistoryIndex] = useState(0)

  const [sceneObjects, setSceneObjectsInternal] = useState<SceneObject[]>(initialSceneObjects)
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [environmentPreset, setEnvironmentPreset] = useState<string>("sunset")
  const [showSidebar, setShowSidebar] = useState(true) // New state for sidebar visibility

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

  const selectedObject = useMemo(
    () => sceneObjects.find((obj) => obj.id === selectedObjectId),
    [selectedObjectId, sceneObjects],
  )

  // Custom setter for sceneObjects that also manages history
  const setSceneObjects = useCallback(
    (newObjects: SceneObject[]) => {
      setSceneObjectsInternal(newObjects)
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1)
        return [...newHistory, newObjects]
      })
      setHistoryIndex((prevIndex) => prevIndex + 1)
    },
    [historyIndex],
  )

  const handleObjectSelect = useCallback((objectId: string | null) => {
    setSelectedObjectId(objectId)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedObjectId(null)
  }, [])

  const handleObjectPropertyChange = useCallback(
    (property: "position" | "rotation" | "scale", axis: 0 | 1 | 2, value: number) => {
      if (!selectedObject) return

      const updatedObjects = sceneObjects.map((obj) =>
        obj.id === selectedObject.id
          ? {
              ...obj,
              [property]: obj[property].map((val, idx) => (idx === axis ? value : val)),
            }
          : obj,
      )
      setSceneObjects(updatedObjects)
    },
    [selectedObject, sceneObjects, setSceneObjects],
  )

  const handleMaterialPropertyChange = useCallback(
    (
      property: keyof Omit<SceneObject, "id" | "name" | "type" | "position" | "rotation" | "scale" | "modelPath">,
      value: any,
    ) => {
      if (!selectedObject) return

      const updatedObjects = sceneObjects.map((obj) =>
        obj.id === selectedObject.id
          ? {
              ...obj,
              [property]: value,
            }
          : obj,
      )
      setSceneObjects(updatedObjects)
    },
    [selectedObject, sceneObjects, setSceneObjects],
  )

  const handleLightPropertyChange = useCallback(
    (
      lightType: "directional" | "point",
      property: keyof LightState | "castShadow" | "shadowMapSize" | "shadowBias",
      value: any,
      axis?: 0 | 1 | 2,
    ) => {
      if (lightType === "directional") {
        setDirectionalLight((prev) => {
          if (property === "position" && axis !== undefined) {
            const newPos = [...prev.position] as [number, number, number]
            newPos[axis] = value
            return { ...prev, position: newPos }
          }
          if (property === "shadowMapSize") {
            return { ...prev, shadowMapSize: [value, value] }
          }
          return { ...prev, [property]: value }
        })
      } else if (lightType === "point") {
        setPointLight((prev) => {
          if (property === "position" && axis !== undefined) {
            const newPos = [...prev.position] as [number, number, number]
            newPos[axis] = value
            return { ...prev, [property]: value }
          }
          return { ...prev, [property]: value }
        })
      }
    },
    [],
  )

  const addShape = useCallback(
    (type: "box" | "sphere" | "gltf", modelPath?: string) => {
      const newId = crypto.randomUUID()
      const newName = `${type.charAt(0).toUpperCase() + type.slice(1)} ${sceneObjects.length + 1}`
      let newObject: SceneObject

      if (type === "gltf") {
        newObject = {
          id: newId,
          name: modelPath ? modelPath.split("/").pop() || newName : newName,
          type: type,
          modelPath: modelPath || "/assets/3d/duck.glb",
          position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          materialColor: "#8e44ad",
          roughness: 0.5,
          metalness: 0,
          emissive: "#000000",
          emissiveIntensity: 0,
          opacity: 1,
          wireframe: false,
        }
      } else {
        newObject = {
          id: newId,
          name: newName,
          type: type,
          position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          materialColor: type === "box" ? "#9b59b6" : "#f39c12",
          roughness: 0.5,
          metalness: 0,
          emissive: "#000000",
          emissiveIntensity: 0,
          opacity: 1,
          wireframe: false,
        }
      }
      setSceneObjects([...sceneObjects, newObject])
      setSelectedObjectId(newId)
    },
    [sceneObjects, setSceneObjects],
  )

  const handleDeleteObject = useCallback(() => {
    if (!selectedObject) return

    const updatedObjects = sceneObjects.filter((obj) => obj.id !== selectedObject.id)
    setSceneObjects(updatedObjects)
    setSelectedObjectId(null)
    toast({
      title: "Object Deleted",
      description: `"${selectedObject.name}" has been removed.`,
    })
  }, [selectedObject, sceneObjects, setSceneObjects, toast])

  // Handle file upload for custom GLTF/GLB models
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

        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            const blob = new Blob([e.target.result], { type: file.type })
            const objectURL = URL.createObjectURL(blob)
            addShape("gltf", objectURL)
            toast({
              title: "Model Uploaded",
              description: `"${file.name}" added to scene.`,
            })
          }
        }
        reader.onerror = () => {
          toast({
            title: "Upload Failed",
            description: "Could not read the file.",
            variant: "destructive",
          })
        }
        reader.readAsArrayBuffer(file)
      }
    },
    [addShape, toast],
  )

  // Cleanup object URLs when components unmount or objects are removed
  useEffect(() => {
    return () => {
      history.forEach((snapshot) => {
        snapshot.forEach((obj) => {
          if (obj.type === "gltf" && obj.modelPath?.startsWith("blob:")) {
            URL.revokeObjectURL(obj.modelPath)
          }
        })
      })
    }
  }, [history])

  // Undo/Redo functions
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setSceneObjectsInternal(history[newIndex])
      setSelectedObjectId(null)
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setSceneObjectsInternal(history[newIndex])
      setSelectedObjectId(null)
    }
  }, [history, historyIndex])

  // Function to reset camera, passed to CameraResetButton
  const resetCamera = useCallback(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset()
    }
  }, [])

  // Helper to convert radians to degrees for display
  const radToDeg = (rad: number) => rad * (180 / Math.PI)
  // Helper to convert degrees to radians for Three.js
  const degToRad = (deg: number) => deg * (Math.PI / 180)

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
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
        <div className="mb-6 p-3 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Camera</h3>
          <p className="text-sm text-gray-600">Use mouse to orbit.</p>
          <CameraResetButton onReset={resetCamera} />
        </div>

        {/* Undo/Redo Controls */}
        <div className="mb-6 p-3 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-2 text-gray-700">History</h3>
          <div className="flex gap-2">
            <Button onClick={handleUndo} disabled={historyIndex === 0} className="w-full">
              Undo
            </Button>
            <Button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="w-full">
              Redo
            </Button>
          </div>
        </div>

        {/* Lighting Controls */}
        <div className="mb-6 p-3 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Lighting</h3>
          <Label htmlFor="environment-preset" className="block mb-1 text-gray-700">
            Environment
          </Label>
          <Select value={environmentPreset} onValueChange={setEnvironmentPreset}>
            <SelectTrigger id="environment-preset" className="w-full h-8">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="dawn">Dawn</SelectItem>
              <SelectItem value="forest">Forest</SelectItem>
              <SelectItem value="lobby">Lobby</SelectItem>
              <SelectItem value="night">Night</SelectItem>
              <SelectItem value="park">Park</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="sunset">Sunset</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          {/* Directional Light */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Directional Light</h4>
            <Label htmlFor="dirLightColor" className="block mb-1 text-gray-700">
              Color
            </Label>
            <Input
              id="dirLightColor"
              type="color"
              value={directionalLight.color}
              onChange={(e) => handleLightPropertyChange("directional", "color", e.target.value)}
              className="h-8 w-full p-0"
            />
            <Label htmlFor="dirLightIntensity" className="block mt-2 mb-1 text-gray-700">
              Intensity
            </Label>
            <Slider
              id="dirLightIntensity"
              min={0}
              max={2}
              step={0.01}
              value={[directionalLight.intensity]}
              onValueChange={(val) => handleLightPropertyChange("directional", "intensity", val[0])}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{directionalLight.intensity.toFixed(2)}</div>

            <Label className="block mt-2 mb-1 text-gray-700">Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[0].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("directional", "position", Number.parseFloat(e.target.value) || 0, 0)
                }
                className="h-8"
              />
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[1].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("directional", "position", Number.parseFloat(e.target.value) || 0, 1)
                }
                className="h-8"
              />
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[2].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("directional", "position", Number.parseFloat(e.target.value) || 0, 2)
                }
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 text-center">
              <span>X</span>
              <span>Y</span>
              <span>Z</span>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="dirLightShadow"
                checked={directionalLight.castShadow}
                onCheckedChange={(checked) => handleLightPropertyChange("directional", "castShadow", checked)}
              />
              <Label
                htmlFor="dirLightShadow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cast Shadow
              </Label>
            </div>
            {directionalLight.castShadow && (
              <>
                <Label htmlFor="shadowMapSize" className="block mt-2 mb-1 text-gray-700">
                  Shadow Map Size
                </Label>
                <Slider
                  id="shadowMapSize"
                  min={256}
                  max={2048}
                  step={256}
                  value={[directionalLight.shadowMapSize[0]]}
                  onValueChange={(val) => handleLightPropertyChange("directional", "shadowMapSize", val[0])}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-right">
                  {directionalLight.shadowMapSize[0]}x{directionalLight.shadowMapSize[1]}
                </div>

                <Label htmlFor="shadowBias" className="block mt-2 mb-1 text-gray-700">
                  Shadow Bias
                </Label>
                <Slider
                  id="shadowBias"
                  min={-0.005}
                  max={0.005}
                  step={0.0001}
                  value={[directionalLight.shadowBias]}
                  onValueChange={(val) => handleLightPropertyChange("directional", "shadowBias", val[0])}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-right">{directionalLight.shadowBias.toFixed(4)}</div>
              </>
            )}
          </div>

          {/* Point Light */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Point Light</h4>
            <Label htmlFor="pointLightColor" className="block mb-1 text-gray-700">
              Color
            </Label>
            <Input
              id="pointLightColor"
              type="color"
              value={pointLight.color}
              onChange={(e) => handleLightPropertyChange("point", "color", e.target.value)}
              className="h-8 w-full p-0"
            />
            <Label htmlFor="pointLightIntensity" className="block mt-2 mb-1 text-gray-700">
              Intensity
            </Label>
            <Slider
              id="pointLightIntensity"
              min={0}
              max={2}
              step={0.01}
              value={[pointLight.intensity]}
              onValueChange={(val) => handleLightPropertyChange("point", "intensity", val[0])}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{pointLight.intensity.toFixed(2)}</div>

            <Label className="block mt-2 mb-1 text-gray-700">Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[0].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("point", "position", Number.parseFloat(e.target.value) || 0, 0)
                }
                className="h-8"
              />
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[1].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("point", "position", Number.parseFloat(e.target.value) || 0, 1)
                }
                className="h-8"
              />
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[2].toFixed(2)}
                onChange={(e) =>
                  handleLightPropertyChange("point", "position", Number.parseFloat(e.target.value) || 0, 2)
                }
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 text-center">
              <span>X</span>
              <span>Y</span>
              <span>Z</span>
            </div>
          </div>
        </div>

        {/* Object Properties */}
        <div className="mb-6 p-3 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Object Properties</h3>
          {selectedObject ? (
            <div className="space-y-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Selected: {selectedObject.name}</p>

              {/* Position Controls */}
              <div>
                <Label className="block mb-1 text-gray-700">Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="posX" className="sr-only">
                      X
                    </Label>
                    <Input
                      id="posX"
                      type="number"
                      step="0.1"
                      value={selectedObject.position[0].toFixed(2)}
                      onChange={(e) =>
                        handleObjectPropertyChange("position", 0, Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">X</span>
                  </div>
                  <div>
                    <Label htmlFor="posY" className="sr-only">
                      Y
                    </Label>
                    <Input
                      id="posY"
                      type="number"
                      step="0.1"
                      value={selectedObject.position[1].toFixed(2)}
                      onChange={(e) =>
                        handleObjectPropertyChange("position", 1, Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
                  </div>
                  <div>
                    <Label htmlFor="posZ" className="sr-only">
                      Z
                    </Label>
                    <Input
                      id="posZ"
                      type="number"
                      step="0.1"
                      value={selectedObject.position[2].toFixed(2)}
                      onChange={(e) =>
                        handleObjectPropertyChange("position", 2, Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Z</span>
                  </div>
                </div>
              </div>

              {/* Rotation Controls */}
              <div>
                <Label className="block mb-1 text-gray-700">Rotation (Deg)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="rotX" className="sr-only">
                      X
                    </Label>
                    <Input
                      id="rotX"
                      type="number"
                      step="1"
                      value={radToDeg(selectedObject.rotation[0]).toFixed(0)}
                      onChange={(e) =>
                        handleObjectPropertyChange("rotation", 0, degToRad(Number.parseFloat(e.target.value) || 0))
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">X</span>
                  </div>
                  <div>
                    <Label htmlFor="rotY" className="sr-only">
                      Y
                    </Label>
                    <Input
                      id="rotY"
                      type="number"
                      step="1"
                      value={radToDeg(selectedObject.rotation[1]).toFixed(0)}
                      onChange={(e) =>
                        handleObjectPropertyChange("rotation", 1, degToRad(Number.parseFloat(e.target.value) || 0))
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
                  </div>
                  <div>
                    <Label htmlFor="rotZ" className="sr-only">
                      Z
                    </Label>
                    <Input
                      id="rotZ"
                      type="number"
                      step="1"
                      value={radToDeg(selectedObject.rotation[2]).toFixed(0)}
                      onChange={(e) =>
                        handleObjectPropertyChange("rotation", 2, degToRad(Number.parseFloat(e.target.value) || 0))
                      }
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Z</span>
                  </div>
                </div>
              </div>

              {/* Scale Controls */}
              <div>
                <Label className="block mb-1 text-gray-700">Scale</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="scaleX" className="sr-only">
                      X
                    </Label>
                    <Input
                      id="scaleX"
                      type="number"
                      step="0.1"
                      value={selectedObject.scale[0].toFixed(2)}
                      onChange={(e) => handleObjectPropertyChange("scale", 0, Number.parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">X</span>
                  </div>
                  <div>
                    <Label htmlFor="scaleY" className="sr-only">
                      Y
                    </Label>
                    <Input
                      id="scaleY"
                      type="number"
                      step="0.1"
                      value={selectedObject.scale[1].toFixed(2)}
                      onChange={(e) => handleObjectPropertyChange("scale", 1, Number.parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
                  </div>
                  <div>
                    <Label htmlFor="scaleZ" className="sr-only">
                      Z
                    </Label>
                    <Input
                      id="scaleZ"
                      type="number"
                      step="0.1"
                      value={selectedObject.scale[2].toFixed(2)}
                      onChange={(e) => handleObjectPropertyChange("scale", 2, Number.parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">Z</span>
                  </div>
                </div>
              </div>

              {/* Material Properties - Only for Box/Sphere types */}
              {selectedObject.type !== "gltf" && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">Material</h4>
                  <Label htmlFor="materialColor" className="block mb-1 text-gray-700">
                    Color
                  </Label>
                  <Input
                    id="materialColor"
                    type="color"
                    value={selectedObject.materialColor}
                    onChange={(e) => handleMaterialPropertyChange("materialColor", e.target.value)}
                    className="h-8 w-full p-0"
                  />

                  <Label htmlFor="roughness" className="block mt-2 mb-1 text-gray-700">
                    Roughness
                  </Label>
                  <Slider
                    id="roughness"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[selectedObject.roughness]}
                    onValueChange={(val) => handleMaterialPropertyChange("roughness", val[0])}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-right">{selectedObject.roughness.toFixed(2)}</div>

                  <Label htmlFor="metalness" className="block mt-2 mb-1 text-gray-700">
                    Metalness
                  </Label>
                  <Slider
                    id="metalness"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[selectedObject.metalness]}
                    onValueChange={(val) => handleMaterialPropertyChange("metalness", val[0])}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-right">{selectedObject.metalness.toFixed(2)}</div>

                  <Label htmlFor="emissiveColor" className="block mt-2 mb-1 text-gray-700">
                    Emissive Color
                  </Label>
                  <Input
                    id="emissiveColor"
                    type="color"
                    value={selectedObject.emissive}
                    onChange={(e) => handleMaterialPropertyChange("emissive", e.target.value)}
                    className="h-8 w-full p-0"
                  />

                  <Label htmlFor="emissiveIntensity" className="block mt-2 mb-1 text-gray-700">
                    Emissive Intensity
                  </Label>
                  <Slider
                    id="emissiveIntensity"
                    min={0}
                    max={2}
                    step={0.01}
                    value={[selectedObject.emissiveIntensity]}
                    onValueChange={(val) => handleMaterialPropertyChange("emissiveIntensity", val[0])}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-right">{selectedObject.emissiveIntensity.toFixed(2)}</div>

                  <Label htmlFor="opacity" className="block mt-2 mb-1 text-gray-700">
                    Opacity
                  </Label>
                  <Slider
                    id="opacity"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[selectedObject.opacity]}
                    onValueChange={(val) => handleMaterialPropertyChange("opacity", val[0])}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-right">{selectedObject.opacity.toFixed(2)}</div>

                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="wireframe"
                      checked={selectedObject.wireframe}
                      onCheckedChange={(checked) => handleMaterialPropertyChange("wireframe", checked)}
                    />
                    <Label
                      htmlFor="wireframe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Wireframe
                    </Label>
                  </div>
                </div>
              )}
              {selectedObject.type === "gltf" && (
                <p className="text-sm text-gray-500 mt-4">
                  Material properties for GLTF models are not editable in this viewer.
                </p>
              )}

              <Button onClick={handleDeleteObject} className="w-full mt-4 bg-red-500 hover:bg-red-600">
                Delete Selected Object
              </Button>
              <Button onClick={clearSelection} className="w-full mt-2">
                Clear Selection
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Click on an object to view and edit its properties.</p>
          )}
        </div>

        {/* Add Objects */}
        <div className="mb-6 p-3 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-2 text-gray-800">Add Objects</h3>
          <div className="flex flex-col gap-2">
            <Button onClick={() => addShape("box")} className="w-full">
              Add Cube
            </Button>
            <Button onClick={() => addShape("sphere")} className="w-full">
              Add Sphere
            </Button>
            <Button onClick={() => addShape("gltf")} className="w-full">
              Add GLTF Model (Duck)
            </Button>
            <Label htmlFor="model-upload" className="block mt-4 mb-1 text-gray-700">
              Upload Custom GLTF/GLB
            </Label>
            <Input id="model-upload" type="file" accept=".glb,.gltf" onChange={handleModelUpload} className="h-9" />
          </div>
        </div>
      </aside>

      {/* 3D Viewport */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        shadows
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
          showSidebar ? "md:left-64" : "md:left-0"
        }`}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={directionalLight.position}
          intensity={directionalLight.intensity}
          color={directionalLight.color}
          castShadow={directionalLight.castShadow}
          shadow-mapSize-width={directionalLight.shadowMapSize[0]}
          shadow-mapSize-height={directionalLight.shadowMapSize[1]}
          shadow-bias={directionalLight.shadowBias}
        />
        <pointLight position={pointLight.position} intensity={pointLight.intensity} color={pointLight.color} />
        {/* Environment component for background and global illumination */}
        <Environment preset={environmentPreset as any} background />
        {/* Ground Plane */}
        <Plane args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial color="#cccccc" />
        </Plane>
        {/* Grid Helper */}
        <Grid
          renderOrder={-1}
          position={[0, -0.01, 0]}
          infiniteGrid
          cellSize={1}
          sectionSize={10}
          fadeDistance={50}
          followCamera
          sectionColor="#888888"
          cellColor="#bbbbbb"
        />
        {/* Render scene objects dynamically */}
        {sceneObjects.map((obj) => (
          <SelectableWrapper
            key={obj.id}
            id={obj.id}
            onSelect={handleObjectSelect}
            isSelected={selectedObjectId === obj.id}
            baseColor={obj.materialColor}
          >
            {({ ref, onPointerOver, onPointerOut, onClick, displayColor }) =>
              obj.type === "box" ? (
                <Box
                  ref={ref}
                  onPointerOver={onPointerOver}
                  onPointerOut={onPointerOut}
                  onClick={onClick}
                  position={obj.position}
                  rotation={obj.rotation}
                  scale={obj.scale}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={displayColor}
                    roughness={obj.roughness}
                    metalness={obj.metalness}
                    emissive={obj.emissive}
                    emissiveIntensity={obj.emissiveIntensity}
                    opacity={obj.opacity}
                    transparent={obj.opacity < 1}
                    wireframe={obj.wireframe}
                  />
                </Box>
              ) : obj.type === "sphere" ? (
                <Sphere
                  ref={ref}
                  onPointerOver={onPointerOver}
                  onPointerOut={onPointerOut}
                  onClick={onClick}
                  position={obj.position}
                  rotation={obj.rotation}
                  scale={obj.scale}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={displayColor}
                    roughness={obj.roughness}
                    metalness={obj.metalness}
                    emissive={obj.emissive}
                    emissiveIntensity={obj.emissiveIntensity}
                    opacity={obj.opacity}
                    transparent={obj.opacity < 1}
                    wireframe={obj.wireframe}
                  />
                </Sphere>
              ) : (
                <GLTFModel
                  ref={ref}
                  onPointerOver={onPointerOver}
                  onPointerOut={onPointerOut}
                  onClick={onClick}
                  modelPath={obj.modelPath!}
                  position={obj.position}
                  rotation={obj.rotation}
                  scale={obj.scale}
                  displayColor={displayColor}
                />
              )
            }
          </SelectableWrapper>
        ))}
        {/* Orbital Camera Controls - now with a ref */}
        <OrbitControls makeDefault ref={orbitControlsRef} />
      </Canvas>
    </div>
  )
}
