"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { SceneObject } from "@/types/scene"

interface ObjectPropertiesProps {
  selectedObject: SceneObject | null
  onPropertyChange: (property: keyof SceneObject, value: any, axis?: 0 | 1 | 2) => void
  onDeleteObject: () => void
  onClearSelection: () => void
}

export const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  onPropertyChange,
  onDeleteObject,
  onClearSelection,
}) => {
  if (!selectedObject) {
    return (
      <div className="mb-6 p-3 border rounded-md bg-gray-50">
        <h3 className="text-md font-semibold mb-2 text-gray-700">Object Properties</h3>
        <p className="text-sm text-gray-600">Click on an object to view and edit its properties.</p>
      </div>
    )
  }

  const radToDeg = (rad: number) => rad * (180 / Math.PI)
  const degToRad = (deg: number) => deg * (Math.PI / 180)

  return (
    <div className="mb-6 p-3 border rounded-md bg-gray-50">
      <h3 className="text-md font-semibold mb-2 text-gray-700">Object Properties</h3>
      <div className="space-y-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-800">Selected: {selectedObject.name}</p>

        {/* Position Controls */}
        <div>
          <Label className="block mb-1 text-gray-700">Position</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="posX" className="sr-only">X</Label>
              <Input
                id="posX"
                type="number"
                step="0.1"
                value={selectedObject.position[0].toFixed(2)}
                onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 0)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">X</span>
            </div>
            <div>
              <Label htmlFor="posY" className="sr-only">Y</Label>
              <Input
                id="posY"
                type="number"
                step="0.1"
                value={selectedObject.position[1].toFixed(2)}
                onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 1)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
            </div>
            <div>
              <Label htmlFor="posZ" className="sr-only">Z</Label>
              <Input
                id="posZ"
                type="number"
                step="0.1"
                value={selectedObject.position[2].toFixed(2)}
                onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 2)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">Z</span>
            </div>
          </div>
        </div>

        {/* Rotation Controls */}
        <div>
          <Label className="block mb-1 text-gray-700">Rotation (Degrees)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="rotX" className="sr-only">X</Label>
              <Input
                id="rotX"
                type="number"
                step="1"
                value={radToDeg(selectedObject.rotation[0]).toFixed(0)}
                onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 0)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">X</span>
            </div>
            <div>
              <Label htmlFor="rotY" className="sr-only">Y</Label>
              <Input
                id="rotY"
                type="number"
                step="1"
                value={radToDeg(selectedObject.rotation[1]).toFixed(0)}
                onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 1)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
            </div>
            <div>
              <Label htmlFor="rotZ" className="sr-only">Z</Label>
              <Input
                id="rotZ"
                type="number"
                step="1"
                value={radToDeg(selectedObject.rotation[2]).toFixed(0)}
                onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 2)}
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
              <Label htmlFor="scaleX" className="sr-only">X</Label>
              <Input
                id="scaleX"
                type="number"
                step="0.1"
                value={selectedObject.scale[0].toFixed(2)}
                onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 1, 0)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">X</span>
            </div>
            <div>
              <Label htmlFor="scaleY" className="sr-only">Y</Label>
              <Input
                id="scaleY"
                type="number"
                step="0.1"
                value={selectedObject.scale[1].toFixed(2)}
                onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 1, 1)}
                className="h-8"
              />
              <span className="text-xs text-gray-500 block text-center mt-1">Y</span>
            </div>
            <div>
              <Label htmlFor="scaleZ" className="sr-only">Z</Label>
              <Input
                id="scaleZ"
                type="number"
                step="0.1"
                value={selectedObject.scale[2].toFixed(2)}
                onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 1, 2)}
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
              onChange={(e) => onPropertyChange("materialColor", e.target.value)}
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
              onValueChange={(val) => onPropertyChange("roughness", val[0])}
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
              onValueChange={(val) => onPropertyChange("metalness", val[0])}
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
              onChange={(e) => onPropertyChange("emissive", e.target.value)}
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
              onValueChange={(val) => onPropertyChange("emissiveIntensity", val[0])}
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
              onValueChange={(val) => onPropertyChange("opacity", val[0])}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{selectedObject.opacity.toFixed(2)}</div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="wireframe"
                checked={selectedObject.wireframe}
                onCheckedChange={(checked) => onPropertyChange("wireframe", checked)}
              />
              <Label htmlFor="wireframe" className="text-sm font-medium leading-none">
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

        <Button onClick={onDeleteObject} className="w-full mt-4 bg-red-500 hover:bg-red-600">
          Delete Selected Object
        </Button>
        <Button onClick={onClearSelection} className="w-full mt-2">
          Clear Selection
        </Button>
      </div>
    </div>
  )
} 