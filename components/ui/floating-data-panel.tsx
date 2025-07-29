"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Star,
  Eye,
  Target,
  Wind,
  Waves,
  EyeOff
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null)
  const [pulseEffect, setPulseEffect] = useState(false)
  const [showUI, setShowUI] = useState(true)

  // Auto-rotate facts with enhanced timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % animal.funFacts.length)
      setPulseEffect(true)
      setTimeout(() => setPulseEffect(false), 300)
    }, 4000) // Change fact every 4 seconds

    return () => clearInterval(interval)
  }, [animal.funFacts.length])

  // Sound toggle handler
  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      // TODO: Play ambient arctic sound
      console.log("Playing arctic ambient sound")
    }
  }, [soundEnabled])

  // Stats toggle handler
  const toggleStats = useCallback(() => {
    setShowStats(!showStats)
  }, [showStats])

  // UI toggle handler
  const toggleUI = useCallback(() => {
    setShowUI(!showUI)
  }, [showUI])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* UI Toggle Button - Always visible */}
      <div className="absolute top-4 right-4 z-40 pointer-events-auto">
        <Button
          onClick={toggleUI}
          size="sm"
          variant="ghost"
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110"
          aria-label={showUI ? "Hide UI" : "Show UI"}
        >
          {showUI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Top Panel - Animal Name & Status */}
      <div className={`absolute top-2 md:top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
        showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div 
          className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-2xl transition-all duration-500 max-w-[90vw] md:max-w-none ${
            hoveredPanel === 'top' ? 'bg-white/20 scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredPanel('top')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500/20 rounded-full animate-pulse">
              <PawPrint className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <h1 className="text-lg md:text-2xl font-bold text-white flex items-center justify-center">
                {animal.name}
                <Snowflake className="h-4 w-4 md:h-5 md:w-5 ml-2 text-blue-300 animate-spin-slow" />
              </h1>
              <p className="text-xs md:text-sm text-blue-200 italic">{animal.scientificName}</p>
            </div>
            <Badge 
              className={`${conservationStatusColors[animal.conservationStatus]} backdrop-blur-sm border-2 font-bold text-sm px-3 py-1 transition-all duration-300 hover:scale-110`}
            >
              <div className="flex items-center space-x-1">
                {conservationStatusIcons[animal.conservationStatus]}
                <span>{animal.conservationStatus}</span>
              </div>
            </Badge>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleSound}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleStats}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel - Habitat & Stats (Desktop) */}
      <div className={`absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 transition-all duration-500 hidden md:block ${
        showUI ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
      }`}>
        <div 
          className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-2xl max-w-[140px] md:max-w-xs transition-all duration-500 ${
            hoveredPanel === 'left' ? 'bg-white/20 scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredPanel('left')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="space-y-4">
            {/* Habitat */}
            <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-300/30 hover:bg-blue-500/30 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-300 animate-bounce" />
                <h3 className="font-bold text-blue-200 text-sm">Habitat</h3>
              </div>
              <p className="text-blue-100 text-xs leading-relaxed">{animal.habitat}</p>
              <div className="flex items-center mt-2 space-x-1">
                <Wind className="h-3 w-3 text-blue-300" />
                <span className="text-blue-200 text-xs">Arctic Winds</span>
              </div>
            </div>

            {/* Stats - Conditional Display */}
            {animal.stats && showStats && (
              <div className="bg-green-500/20 rounded-xl p-3 border border-green-300/30 hover:bg-green-500/30 transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-green-300 animate-pulse" />
                  <h3 className="font-bold text-green-200 text-sm">Quick Stats</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-green-500/10 rounded p-1">
                    <span className="text-green-100">Weight:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.weight}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-500/10 rounded p-1">
                    <span className="text-green-100">Height:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.height}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-500/10 rounded p-1">
                    <span className="text-green-100">Speed:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.speed}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-500/10 rounded p-1">
                    <span className="text-green-100">Lifespan:</span>
                    <span className="text-green-200 font-semibold">{animal.stats.lifespan}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Diet & Fun Facts (Desktop) */}
      <div className={`absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 transition-all duration-500 hidden md:block ${
        showUI ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}>
        <div 
          className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-2xl max-w-[140px] md:max-w-xs transition-all duration-500 ${
            hoveredPanel === 'right' ? 'bg-white/20 scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredPanel('right')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="space-y-4">
            {/* Diet */}
            <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-300/30 hover:bg-yellow-500/30 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Utensils className="h-4 w-4 text-yellow-300 animate-pulse" />
                <h3 className="font-bold text-yellow-200 text-sm">Diet</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {animal.diet.slice(0, 4).map((food, index) => (
                  <Badge 
                    key={index}
                    className="bg-yellow-500/30 text-yellow-200 border border-yellow-300/50 text-xs hover:bg-yellow-500/50 transition-all duration-200 hover:scale-105"
                  >
                    {food}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center mt-2 space-x-1">
                <Target className="h-3 w-3 text-yellow-300" />
                <span className="text-yellow-200 text-xs">Primary: Seals</span>
              </div>
            </div>

            {/* Fun Facts */}
            <div className={`bg-purple-500/20 rounded-xl p-3 border border-purple-300/30 hover:bg-purple-500/30 transition-all duration-300 ${
              pulseEffect ? 'animate-pulse' : ''
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-4 w-4 text-purple-300 animate-bounce" />
                <h3 className="font-bold text-purple-200 text-sm">Fun Fact #{currentFactIndex + 1}</h3>
              </div>
              <p className="text-purple-100 text-xs italic leading-relaxed">
                "{animal.funFacts[currentFactIndex]}"
              </p>
              <div className="flex justify-center space-x-1 mt-2">
                {animal.funFacts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFactIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentFactIndex 
                        ? 'bg-purple-400 scale-125' 
                        : 'bg-purple-300/50'
                    }`}
                    aria-label={`Go to fact ${index + 1}`}
                    title={`Fact ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center mt-2">
                <Star className="h-3 w-3 text-purple-300 animate-pulse" />
                <span className="text-purple-200 text-xs ml-1">Click dots to explore!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Conservation Info */}
      <div className={`absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
        showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div 
          className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-2xl transition-all duration-500 ${
            hoveredPanel === 'bottom' ? 'bg-white/20 scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredPanel('bottom')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-orange-300 animate-pulse" />
              <span className="text-orange-200 text-xs md:text-sm font-semibold">Conservation Status:</span>
            </div>
            <Badge 
              className={`${conservationStatusColors[animal.conservationStatus]} backdrop-blur-sm border-2 font-bold text-xs md:text-sm px-2 md:px-3 py-1 transition-all duration-300 hover:scale-110`}
            >
              <div className="flex items-center space-x-1">
                {conservationStatusIcons[animal.conservationStatus]}
                <span>{animal.conservationStatus}</span>
              </div>
            </Badge>
            <div className="flex items-center space-x-2">
              <Droplets className="h-3 w-3 md:h-4 md:w-4 text-blue-300 animate-bounce" />
              <span className="text-blue-200 text-xs md:text-sm">Arctic Region</span>
            </div>
            <div className="flex items-center space-x-2">
              <Waves className="h-3 w-3 md:h-4 md:w-4 text-cyan-300 animate-pulse" />
              <span className="text-cyan-200 text-xs md:text-sm">Sea Ice Habitat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Stacked Information */}
      <div className={`absolute bottom-20 left-2 right-2 md:hidden transition-all duration-500 ${
        showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="space-y-4">
            {/* Mobile Habitat & Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Habitat */}
              <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-300/30">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-300" />
                  <h3 className="font-bold text-blue-200 text-sm">Habitat</h3>
                </div>
                <p className="text-blue-100 text-xs">{animal.habitat}</p>
              </div>

              {/* Stats */}
              {animal.stats && showStats && (
                <div className="bg-green-500/20 rounded-xl p-3 border border-green-300/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-green-300" />
                    <h3 className="font-bold text-green-200 text-sm">Stats</h3>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-green-100">Weight:</span>
                      <span className="text-green-200 font-semibold">{animal.stats.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Speed:</span>
                      <span className="text-green-200 font-semibold">{animal.stats.speed}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Diet & Fun Facts Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Diet */}
              <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-300/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Utensils className="h-4 w-4 text-yellow-300" />
                  <h3 className="font-bold text-yellow-200 text-sm">Diet</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {animal.diet.slice(0, 2).map((food, index) => (
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
                    <button
                      key={index}
                      onClick={() => setCurrentFactIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentFactIndex 
                          ? 'bg-purple-400' 
                          : 'bg-purple-300/50'
                      }`}
                      aria-label={`Go to fact ${index + 1}`}
                      title={`Fact ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Snowflakes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            <Snowflake className="h-3 w-3 text-blue-300/40" />
          </div>
        ))}
        
        {/* Sparkles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Star className="h-2 w-2 text-yellow-300/60" />
          </div>
        ))}
        
        {/* Wind particles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`wind-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Wind className="h-2 w-2 text-cyan-300/50" />
          </div>
        ))}
      </div>
    </div>
  )
} 