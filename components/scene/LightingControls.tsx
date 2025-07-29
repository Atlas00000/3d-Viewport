"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DirectionalLightState, LightState } from "@/types/scene"

interface LightingControlsProps {
  environmentPreset: string
  onEnvironmentChange: (preset: string) => void
  directionalLight: DirectionalLightState
  pointLight: LightState
  onDirectionalLightChange: (property: keyof DirectionalLightState, value: any, axis?: 0 | 1 | 2) => void
  onPointLightChange: (property: keyof LightState, value: any, axis?: 0 | 1 | 2) => void
}

export const LightingControls: React.FC<LightingControlsProps> = ({
  environmentPreset,
  onEnvironmentChange,
  directionalLight,
  pointLight,
  onDirectionalLightChange,
  onPointLightChange,
}) => {
  return (
    <div className="mb-6 p-3 border rounded-md bg-gray-50">
      <h3 className="text-md font-semibold mb-2 text-gray-700">Lighting</h3>
      
      {/* Environment Preset */}
      <Label htmlFor="environment-preset" className="block mb-1 text-gray-700">
        Environment
      </Label>
      <Select value={environmentPreset} onValueChange={onEnvironmentChange}>
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
          onChange={(e) => onDirectionalLightChange("color", e.target.value)}
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
          onValueChange={(val) => onDirectionalLightChange("intensity", val[0])}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{directionalLight.intensity.toFixed(2)}</div>

        <Label className="block mt-2 mb-1 text-gray-700">Position</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            step="0.1"
            value={directionalLight.position[0].toFixed(2)}
            onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 0)}
            className="h-8"
          />
          <Input
            type="number"
            step="0.1"
            value={directionalLight.position[1].toFixed(2)}
            onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 1)}
            className="h-8"
          />
          <Input
            type="number"
            step="0.1"
            value={directionalLight.position[2].toFixed(2)}
            onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 2)}
            className="h-8"
          />
        </div>
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
          onChange={(e) => onPointLightChange("color", e.target.value)}
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
          onValueChange={(val) => onPointLightChange("intensity", val[0])}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{pointLight.intensity.toFixed(2)}</div>

        <Label className="block mt-2 mb-1 text-gray-700">Position</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            step="0.1"
            value={pointLight.position[0].toFixed(2)}
            onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 0)}
            className="h-8"
          />
          <Input
            type="number"
            step="0.1"
            value={pointLight.position[1].toFixed(2)}
            onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 1)}
            className="h-8"
          />
          <Input
            type="number"
            step="0.1"
            value={pointLight.position[2].toFixed(2)}
            onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 2)}
            className="h-8"
          />
        </div>
      </div>
    </div>
  )
} 