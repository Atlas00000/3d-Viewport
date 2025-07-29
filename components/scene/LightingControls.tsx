"use client"

import React, { memo } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DirectionalLightState, LightState } from "@/types/scene"
import { Sun, Lightbulb, Palette } from "lucide-react"

interface LightingControlsProps {
  environmentPreset: string
  onEnvironmentChange: (preset: string) => void
  directionalLight: DirectionalLightState
  pointLight: LightState
  onDirectionalLightChange: (property: keyof DirectionalLightState, value: any, axis?: 0 | 1 | 2) => void
  onPointLightChange: (property: keyof LightState, value: any, axis?: 0 | 1 | 2) => void
}

export const LightingControls: React.FC<LightingControlsProps> = memo(({
  environmentPreset,
  onEnvironmentChange,
  directionalLight,
  pointLight,
  onDirectionalLightChange,
  onPointLightChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Environment Preset */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border-2 border-purple-300">
        <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          World Environment
        </h3>
        <Label htmlFor="environment-preset" className="block mb-2 text-sm font-bold text-purple-700">
          🌍 Choose Background
        </Label>
        <Select value={environmentPreset} onValueChange={onEnvironmentChange}>
          <SelectTrigger id="environment-preset" className="w-full h-10 bg-white/80 border-2 border-purple-300 rounded-lg">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">🏢 Apartment</SelectItem>
            <SelectItem value="city">🌆 City</SelectItem>
            <SelectItem value="dawn">🌅 Dawn</SelectItem>
            <SelectItem value="forest">🌲 Forest</SelectItem>
            <SelectItem value="lobby">🏛️ Lobby</SelectItem>
            <SelectItem value="night">🌙 Night</SelectItem>
            <SelectItem value="park">🌳 Park</SelectItem>
            <SelectItem value="studio">🎬 Studio</SelectItem>
            <SelectItem value="sunset">🌇 Sunset</SelectItem>
            <SelectItem value="warehouse">🏭 Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Directional Light */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 border-2 border-yellow-300">
        <h3 className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
          <Sun className="h-4 w-4 mr-2" />
          Sun Light ☀️
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="dirLightColor" className="block mb-2 text-sm font-bold text-yellow-700">
              🌈 Color
            </Label>
            <Input
              id="dirLightColor"
              type="color"
              value={directionalLight.color}
              onChange={(e) => onDirectionalLightChange("color", e.target.value)}
              className="h-10 w-full p-1 bg-white/80 border-2 border-yellow-300 rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="dirLightIntensity" className="block mb-2 text-sm font-bold text-yellow-700">
              💡 Brightness
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
            <div className="text-xs text-yellow-600 text-right font-bold">
              {directionalLight.intensity.toFixed(2)}
            </div>
          </div>

          <div>
            <Label className="block mb-2 text-sm font-bold text-yellow-700">
              📍 Position (X, Y, Z)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[0].toFixed(2)}
                onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 0)}
                className="h-8 bg-white/80 border-2 border-yellow-300 rounded-lg text-center"
                placeholder="X"
              />
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[1].toFixed(2)}
                onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 1)}
                className="h-8 bg-white/80 border-2 border-yellow-300 rounded-lg text-center"
                placeholder="Y"
              />
              <Input
                type="number"
                step="0.1"
                value={directionalLight.position[2].toFixed(2)}
                onChange={(e) => onDirectionalLightChange("position", Number.parseFloat(e.target.value) || 0, 2)}
                className="h-8 bg-white/80 border-2 border-yellow-300 rounded-lg text-center"
                placeholder="Z"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Point Light */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 border-2 border-blue-300">
        <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          Spot Light 💡
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="pointLightColor" className="block mb-2 text-sm font-bold text-blue-700">
              🌈 Color
            </Label>
            <Input
              id="pointLightColor"
              type="color"
              value={pointLight.color}
              onChange={(e) => onPointLightChange("color", e.target.value)}
              className="h-10 w-full p-1 bg-white/80 border-2 border-blue-300 rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="pointLightIntensity" className="block mb-2 text-sm font-bold text-blue-700">
              💡 Brightness
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
            <div className="text-xs text-blue-600 text-right font-bold">
              {pointLight.intensity.toFixed(2)}
            </div>
          </div>

          <div>
            <Label className="block mb-2 text-sm font-bold text-blue-700">
              📍 Position (X, Y, Z)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[0].toFixed(2)}
                onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 0)}
                className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center"
                placeholder="X"
              />
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[1].toFixed(2)}
                onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 1)}
                className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center"
                placeholder="Y"
              />
              <Input
                type="number"
                step="0.1"
                value={pointLight.position[2].toFixed(2)}
                onChange={(e) => onPointLightChange("position", Number.parseFloat(e.target.value) || 0, 2)}
                className="h-8 bg-white/80 border-2 border-blue-300 rounded-lg text-center"
                placeholder="Z"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

LightingControls.displayName = 'LightingControls' 