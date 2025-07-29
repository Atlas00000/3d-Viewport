"use client"

import React, { memo } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RotateCcw } from "lucide-react"

interface CameraControlsProps {
  onReset: () => void
}

export const CameraControls: React.FC<CameraControlsProps> = memo(({ onReset }) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 border-2 border-blue-300">
      <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
        <Camera className="h-4 w-4 mr-2" />
        Camera Controls
      </h3>
      <div className="space-y-3">
        <div className="bg-white/60 rounded-lg p-2 border border-blue-200">
          <p className="text-xs text-blue-700 font-bold mb-1">🎮 How to Control:</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• 🖱️ Drag to rotate view</li>
            <li>• 🔍 Scroll to zoom in/out</li>
            <li>• 📱 Touch to move on mobile</li>
          </ul>
        </div>
        <Button 
          onClick={onReset} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-600 rounded-lg font-bold text-sm"
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Camera View 🔄
        </Button>
      </div>
    </div>
  )
})

CameraControls.displayName = 'CameraControls' 