"use client"

import React, { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Undo2, Redo2, Box, Circle, FileUp, Upload } from "lucide-react"

interface SceneControlsProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onAddBox: () => void
  onAddSphere: () => void
  onAddGLTF: () => void
  onModelUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SceneControls: React.FC<SceneControlsProps> = memo(({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddBox,
  onAddSphere,
  onAddGLTF,
  onModelUpload,
}) => {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      {/* History Controls */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 border-2 border-yellow-300">
        <h3 className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
          <span className="mr-2">⏰</span>
          Time Machine
        </h3>
        <div className="flex gap-2">
          <Button 
            onClick={onUndo} 
            disabled={!canUndo} 
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-600 rounded-lg font-bold text-sm"
            size="sm"
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button 
            onClick={onRedo} 
            disabled={!canRedo} 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600 rounded-lg font-bold text-sm"
            size="sm"
          >
            <Redo2 className="h-4 w-4 mr-1" />
            Redo
          </Button>
        </div>
      </div>

      {/* Add Objects */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 border-2 border-green-300">
        <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center">
          <span className="mr-2">🎨</span>
          Create Objects
        </h3>
        <div className="space-y-2">
          <Button 
            onClick={onAddBox} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-600 rounded-lg font-bold text-sm"
            size="sm"
          >
            <Box className="h-4 w-4 mr-2" />
            Add Cube 📦
          </Button>
          <Button 
            onClick={onAddSphere} 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-600 rounded-lg font-bold text-sm"
            size="sm"
          >
            <Circle className="h-4 w-4 mr-2" />
            Add Sphere ⚪
          </Button>
          <Button 
            onClick={onAddGLTF} 
            className="w-full bg-green-500 hover:bg-green-600 text-white border-2 border-green-600 rounded-lg font-bold text-sm"
            size="sm"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Add Duck Model 🦆
          </Button>
          
          <div className="mt-4 pt-3 border-t-2 border-green-200">
            <Label htmlFor="model-upload" className="block mb-2 text-sm font-bold text-green-800 flex items-center">
              <Upload className="h-4 w-4 mr-1" />
              Upload Your Own Model
            </Label>
            <div className="relative">
              <Input
                id="model-upload"
                type="file"
                accept=".glb,.gltf"
                onChange={onModelUpload}
                className="h-10 bg-white/80 border-2 border-green-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-green-500 file:text-white hover:file:bg-green-600"
              />
            </div>
            <p className="text-xs text-green-600 mt-1">
              Supports .glb and .gltf files
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

SceneControls.displayName = 'SceneControls' 