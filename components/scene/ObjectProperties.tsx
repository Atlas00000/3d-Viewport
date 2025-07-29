"use client"

import React, { memo } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { SceneObject } from "@/types/scene"
import { Settings, Trash2, X, Palette, Box, RotateCcw, Move, Zap } from "lucide-react"

interface ObjectPropertiesProps {
  selectedObject: SceneObject | null
  onPropertyChange: (property: keyof SceneObject, value: any, axis?: 0 | 1 | 2) => void
  onDeleteObject: () => void
  onClearSelection: () => void
}

export const ObjectProperties: React.FC<ObjectPropertiesProps> = memo(({
  selectedObject,
  onPropertyChange,
  onDeleteObject,
  onClearSelection,
}) => {
  if (!selectedObject) {
    return (
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 border-2 border-gray-300 text-center">
        <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-700 mb-2">Object Properties</h3>
        <p className="text-xs text-gray-600">Click on an object to view and edit its properties! 🎯</p>
      </div>
    )
  }

  const radToDeg = (rad: number) => rad * (180 / Math.PI)
  const degToRad = (deg: number) => deg * (Math.PI / 180)

  return (
    <div className="space-y-4">
      {/* Object Info */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 border-2 border-green-300">
        <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center">
          <Box className="h-4 w-4 mr-2" />
          Object Properties
        </h3>
        <div className="bg-white/60 rounded-lg p-2 border border-green-200">
          <p className="text-sm font-bold text-green-700">
            Selected: <span className="text-green-800">{selectedObject.name}</span>
          </p>
          <p className="text-xs text-green-600">
            Type: <span className="font-bold">{selectedObject.type.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Position Controls */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 border-2 border-blue-300">
        <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
          <Move className="h-4 w-4 mr-2" />
          Position 📍
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="posX" className="block text-xs font-bold text-blue-700 mb-1">X</Label>
            <Input
              id="posX"
              type="number"
              step="0.1"
              value={selectedObject.position[0].toFixed(2)}
              onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 0)}
              className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="posY" className="block text-xs font-bold text-blue-700 mb-1">Y</Label>
            <Input
              id="posY"
              type="number"
              step="0.1"
              value={selectedObject.position[1].toFixed(2)}
              onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 1)}
              className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="posZ" className="block text-xs font-bold text-blue-700 mb-1">Z</Label>
            <Input
              id="posZ"
              type="number"
              step="0.1"
              value={selectedObject.position[2].toFixed(2)}
              onChange={(e) => onPropertyChange("position", Number.parseFloat(e.target.value) || 0, 2)}
              className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border-2 border-purple-300">
        <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center">
          <RotateCcw className="h-4 w-4 mr-2" />
          Rotation 🔄
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="rotX" className="block text-xs font-bold text-purple-700 mb-1">X</Label>
            <Input
              id="rotX"
              type="number"
              step="1"
              value={radToDeg(selectedObject.rotation[0]).toFixed(0)}
              onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 0)}
              className="h-8 bg-white/80 border-2 border-purple-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="rotY" className="block text-xs font-bold text-purple-700 mb-1">Y</Label>
            <Input
              id="rotY"
              type="number"
              step="1"
              value={radToDeg(selectedObject.rotation[1]).toFixed(0)}
              onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 1)}
              className="h-8 bg-white/80 border-2 border-purple-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="rotZ" className="block text-xs font-bold text-purple-700 mb-1">Z</Label>
            <Input
              id="rotZ"
              type="number"
              step="1"
              value={radToDeg(selectedObject.rotation[2]).toFixed(0)}
              onChange={(e) => onPropertyChange("rotation", degToRad(Number.parseFloat(e.target.value) || 0), 2)}
              className="h-8 bg-white/80 border-2 border-purple-300 rounded-lg text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Scale Controls */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 border-2 border-orange-300">
        <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Scale 📏
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="scaleX" className="block text-xs font-bold text-orange-700 mb-1">X</Label>
            <Input
              id="scaleX"
              type="number"
              step="0.1"
              value={selectedObject.scale[0].toFixed(2)}
              onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 0, 0)}
              className="h-8 bg-white/80 border-2 border-orange-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="scaleY" className="block text-xs font-bold text-orange-700 mb-1">Y</Label>
            <Input
              id="scaleY"
              type="number"
              step="0.1"
              value={selectedObject.scale[1].toFixed(2)}
              onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 0, 1)}
              className="h-8 bg-white/80 border-2 border-orange-300 rounded-lg text-center text-sm"
            />
          </div>
          <div>
            <Label htmlFor="scaleZ" className="block text-xs font-bold text-orange-700 mb-1">Z</Label>
            <Input
              id="scaleZ"
              type="number"
              step="0.1"
              value={selectedObject.scale[2].toFixed(2)}
              onChange={(e) => onPropertyChange("scale", Number.parseFloat(e.target.value) || 0, 2)}
              className="h-8 bg-white/80 border-2 border-orange-300 rounded-lg text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Material Properties - Only for Box/Sphere types */}
      {selectedObject.type !== "gltf" && (
        <div className="bg-gradient-to-r from-yellow-100 to-green-100 rounded-lg p-3 border-2 border-yellow-300">
          <h3 className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Material Properties 🎨
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="materialColor" className="block text-xs font-bold text-yellow-700 mb-2">
                🌈 Color
              </Label>
              <Input
                id="materialColor"
                type="color"
                value={selectedObject.materialColor}
                onChange={(e) => onPropertyChange("materialColor", e.target.value)}
                className="h-10 w-full p-1 bg-white/80 border-2 border-yellow-300 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="roughness" className="block text-xs font-bold text-yellow-700 mb-2">
                🪨 Roughness
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
              <div className="text-xs text-yellow-600 text-right font-bold">
                {selectedObject.roughness.toFixed(2)}
              </div>
            </div>

            <div>
              <Label htmlFor="metalness" className="block text-xs font-bold text-yellow-700 mb-2">
                ⚡ Metalness
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
              <div className="text-xs text-yellow-600 text-right font-bold">
                {selectedObject.metalness.toFixed(2)}
              </div>
            </div>

            <div>
              <Label htmlFor="emissiveColor" className="block text-xs font-bold text-yellow-700 mb-2">
                💡 Glow Color
              </Label>
              <Input
                id="emissiveColor"
                type="color"
                value={selectedObject.emissive}
                onChange={(e) => onPropertyChange("emissive", e.target.value)}
                className="h-10 w-full p-1 bg-white/80 border-2 border-yellow-300 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="emissiveIntensity" className="block text-xs font-bold text-yellow-700 mb-2">
                💡 Glow Brightness
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
              <div className="text-xs text-yellow-600 text-right font-bold">
                {selectedObject.emissiveIntensity.toFixed(2)}
              </div>
            </div>

            <div>
              <Label htmlFor="opacity" className="block text-xs font-bold text-yellow-700 mb-2">
                👻 Transparency
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
              <div className="text-xs text-yellow-600 text-right font-bold">
                {selectedObject.opacity.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-yellow-200">
              <Checkbox
                id="wireframe"
                checked={selectedObject.wireframe}
                onCheckedChange={(checked) => onPropertyChange("wireframe", checked)}
                className="border-2 border-yellow-400"
              />
              <Label
                htmlFor="wireframe"
                className="text-xs font-bold text-yellow-700"
              >
                🕸️ Wireframe Mode
              </Label>
            </div>
          </div>
        </div>
      )}
      
      {selectedObject.type === "gltf" && (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 border-2 border-gray-300">
          <p className="text-xs text-gray-600 text-center">
            🎭 Material properties for GLTF models are not editable in this viewer.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          onClick={onDeleteObject} 
          className="w-full bg-red-500 hover:bg-red-600 text-white border-2 border-red-600 rounded-lg font-bold text-sm"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Object 🗑️
        </Button>
        <Button 
          onClick={onClearSelection} 
          className="w-full bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-600 rounded-lg font-bold text-sm"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Selection ❌
        </Button>
      </div>
    </div>
  )
})

ObjectProperties.displayName = 'ObjectProperties' 