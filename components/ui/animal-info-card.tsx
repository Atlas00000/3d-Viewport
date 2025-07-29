"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Utensils, 
  Shield, 
  Info, 
  X, 
  Snowflake,
  PawPrint,
  Heart,
  AlertTriangle
} from "lucide-react"

interface AnimalInfoCardProps {
  animal: {
    name: string
    scientificName: string
    habitat: string
    diet: string[]
    conservationStatus: "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered"
    funFacts: string[]
    image?: string
  }
  isOpen: boolean
  onClose: () => void
}

const conservationStatusColors = {
  "Least Concern": "bg-green-100 text-green-800 border-green-200",
  "Near Threatened": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Vulnerable": "bg-orange-100 text-orange-800 border-orange-200",
  "Endangered": "bg-red-100 text-red-800 border-red-200",
  "Critically Endangered": "bg-red-200 text-red-900 border-red-300"
}

const conservationStatusIcons = {
  "Least Concern": <Heart className="h-4 w-4" />,
  "Near Threatened": <AlertTriangle className="h-4 w-4" />,
  "Vulnerable": <AlertTriangle className="h-4 w-4" />,
  "Endangered": <AlertTriangle className="h-4 w-4" />,
  "Critically Endangered": <AlertTriangle className="h-4 w-4" />
}

export const AnimalInfoCard: React.FC<AnimalInfoCardProps> = ({
  animal,
  isOpen,
  onClose
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-2 border-blue-200 shadow-2xl">
          {/* Header with close button */}
          <CardHeader className="relative bg-gradient-to-r from-blue-100 to-cyan-100 border-b-2 border-blue-200">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 bg-white/80 hover:bg-white text-blue-600 border border-blue-200"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <PawPrint className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-blue-800 flex items-center">
                  {animal.name}
                  <Snowflake className="h-5 w-5 ml-2 text-blue-400" />
                </CardTitle>
                <p className="text-sm text-blue-600 italic">{animal.scientificName}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Conservation Status */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-orange-800">Conservation Status</h3>
              </div>
              <Badge 
                className={`${conservationStatusColors[animal.conservationStatus]} border-2 font-bold text-sm px-3 py-1`}
              >
                <div className="flex items-center space-x-1">
                  {conservationStatusIcons[animal.conservationStatus]}
                  <span>{animal.conservationStatus}</span>
                </div>
              </Badge>
            </div>

            {/* Habitat */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-green-800">Habitat</h3>
              </div>
              <p className="text-green-700 text-lg">{animal.habitat}</p>
            </div>

            {/* Diet */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
              <div className="flex items-center space-x-2 mb-3">
                <Utensils className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">Diet</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {animal.diet.map((food, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-yellow-100 text-yellow-800 border border-yellow-300"
                  >
                    {food}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-purple-800">Fun Facts</h3>
              </div>
              <div className="space-y-3">
                <p className="text-purple-700 text-lg italic">
                  "{animal.funFacts[currentFactIndex]}"
                </p>
                <div className="flex justify-center space-x-2">
                  {animal.funFacts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFactIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentFactIndex 
                          ? 'bg-purple-600' 
                          : 'bg-purple-300'
                      }`}
                      aria-label={`Go to fact ${index + 1}`}
                      title={`Fact ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-600"
                onClick={() => {
                  // TODO: Play animal sound
                  console.log("Playing animal sound")
                }}
              >
                🔊 Hear Sound
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  // TODO: Show more details
                  console.log("Show more details")
                }}
              >
                📚 Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 