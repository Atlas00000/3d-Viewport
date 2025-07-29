"use client"

import React, { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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
    <>
      {/* Undo/Redo Controls */}
      <div className="mb-6 p-3 border rounded-md bg-gray-50">
        <h3 className="text-md font-semibold mb-2 text-gray-700">History</h3>
        <div className="flex gap-2">
          <Button onClick={onUndo} disabled={!canUndo} className="w-full">
            Undo
          </Button>
          <Button onClick={onRedo} disabled={!canRedo} className="w-full">
            Redo
          </Button>
        </div>
      </div>

      {/* Add Objects */}
      <div className="mb-6 p-3 border rounded-md bg-gray-50">
        <h3 className="text-md font-semibold mb-2 text-gray-800">Add Objects</h3>
        <div className="flex flex-col gap-2">
          <Button onClick={onAddBox} className="w-full">
            Add Cube
          </Button>
          <Button onClick={onAddSphere} className="w-full">
            Add Sphere
          </Button>
          <Button onClick={onAddGLTF} className="w-full">
            Add GLTF Model (Duck)
          </Button>
          <Label htmlFor="model-upload" className="block mt-4 mb-1 text-gray-700">
            Upload Custom GLTF/GLB
          </Label>
          <Input
            id="model-upload"
            type="file"
            accept=".glb,.gltf"
            onChange={onModelUpload}
            className="h-9"
          />
        </div>
      </div>
    </>
  )
})

SceneControls.displayName = 'SceneControls' 