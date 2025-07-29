"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Utensils, 
  Shield, 
  Info, 
  Snowflake,
  PawPrint,
  Heart,
  AlertTriangle,
  Droplets,
  Thermometer,
  Zap
} from "lucide-react"

interface FloatingDataPanelProps {
  animal: {
    name: string
    scientificName: string
    habitat: string
    diet: string[]
    conservationStatus: "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered"
    funFacts: string[]
    stats?: {
      weight: string
      height: string
      lifespan: string
      speed: string
    }
  }
}

const conservationStatusColors = {
  "Least Concern": "bg-green-500/20 text-green-700 border-green-300",
  "Near Threatened": "bg-yellow-500/20 text-yellow-700 border-yellow-300",
  "Vulnerable": "bg-orange-500/20 text-orange-700 border-orange-300",
  "Endangered": "bg-red-500/20 text-red-700 border-red-300",
  "Critically Endangered": "bg-red-600/20 text-red-800 border-red-400"
}

const conservationStatusIcons = {
  "Least Concern": <Heart className="h-4 w-4" />,
  "Near Threatened": <AlertTriangle className="h-4 w-4" />,
  "Vulnerable": <AlertTriangle className="h-4 w-4" />,
  "Endangered": <AlertTriangle className="h-4 w-4" />,
  "Critically Endangered": <AlertTriangle className="h-4 w-4" />
}

export const FloatingDataPanel: React.FC<FloatingDataPanelProps> = ({ animal }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-rotate facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % animal.funFacts.length)
    }, 5000) // Change fact every 5 seconds

    return () => clearInterval(interval)
  }, [animal.funFacts.length])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Panel - Animal Name & Status */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <PawPrint className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center justify-center">
                {animal.name}
                <Snowflake className="h-5 w-5 ml-2 text-blue-300" />
              </h1>
              <p className="text-sm text-blue-200 italic">{animal.scientificName}</p>
            </div>
            <Badge 
              className={`${conservationStatusColors[animal.conservationStatus]} backdrop-blur-sm border-2 font-bold text-sm px-3 py-1`}
            >
              <div className="flex items-center space-x-1">
                {conservationStatusIcons[animal.conservationStatus]}
                <span>{animal.conservationStatus}</span>
              </div>
            </Badge>
          </div>
        </div>
      </div>

      {/* Left Panel - Habitat & Stats */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl max-w-xs">
          <div className="space-y-4">
            {/* Habitat */}
            <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-300/30">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-300" />
                <h3 className="font-bold text-blue-200 text-sm">Habitat</h3>
              </div>
              <p className="text-blue-100 text-xs">{animal.habitat}</p>
            </div>

            {/* Stats */}
            {animal.stats && (
              <div className="bg-green-500/20 rounded-xl p-3 border border-green-300/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-green-300" />
                  <h3 className="font-bold text-green-200 text-sm">Quick Stats</h3>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-green-100">Weight:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Height:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Speed:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.speed}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Diet & Fun Facts */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl max-w-xs">
          <div className="space-y-4">
            {/* Diet */}
            <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-300/30">
              <div className="flex items-center space-x-2 mb-2">
                <Utensils className="h-4 w-4 text-yellow-300" />
                <h3 className="font-bold text-yellow-200 text-sm">Diet</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {animal.diet.slice(0, 3).map((food, index) => (
                  <Badge 
                    key={index}
                    className="bg-yellow-500/30 text-yellow-200 border border-yellow-300/50 text-xs"
                  >
                    {food}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-purple-500/20 rounded-xl p-3 border border-purple-300/30">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-4 w-4 text-purple-300" />
                <h3 className="font-bold text-purple-200 text-sm">Fun Fact</h3>
              </div>
              <p className="text-purple-100 text-xs italic leading-relaxed">
                "{animal.funFacts[currentFactIndex]}"
              </p>
              <div className="flex justify-center space-x-1 mt-2">
                {animal.funFacts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentFactIndex 
                        ? 'bg-purple-400' 
                        : 'bg-purple-300/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Conservation Info */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-300" />
              <span className="text-orange-200 text-sm font-semibold">Conservation Status:</span>
            </div>
            <Badge 
              className={`${conservationStatusColors[animal.conservationStatus]} backdrop-blur-sm border-2 font-bold text-sm px-3 py-1`}
            >
              <div className="flex items-center space-x-1">
                {conservationStatusIcons[animal.conservationStatus]}
                <span>{animal.conservationStatus}</span>
              </div>
            </Badge>
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-300" />
              <span className="text-blue-200 text-sm">Arctic Region</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Snowflake className="h-3 w-3 text-blue-300/50" />
          </div>
        ))}
      </div>
    </div>
  )
} 