"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface CameraControlsProps {
  onReset: () => void
}

export const CameraControls: React.FC<CameraControlsProps> = ({ onReset }) => {
  return (
    <div className="mb-6 p-3 border rounded-md bg-gray-50">
      <h3 className="text-md font-semibold mb-2 text-gray-700">Camera</h3>
      <p className="text-sm text-gray-600 mb-2">Use mouse to orbit.</p>
      <Button onClick={onReset} className="w-full">
        Reset Camera
      </Button>
    </div>
  )
} 