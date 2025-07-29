"use client"

import React, { forwardRef, useState, useRef, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import { Loading } from "@/components/ui/loading"


interface GLTFModelProps {
  modelPath: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  displayColor: string
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void
  onClick?: (event: ThreeEvent<PointerEvent>) => void
}

export const GLTFModel = forwardRef<any, GLTFModelProps>(({
  modelPath,
  position,
  rotation,
  scale,
  displayColor,
  onPointerOver,
  onPointerOut,
  onClick,
}, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const mixerRef = useRef<any>(null)
  const animationsRef = useRef<any[]>([])

  const { scene, animations } = useGLTF(modelPath, true, true, (error) => {
    console.error('Error loading GLTF model:', error)
    setHasError(true)
    setIsLoading(false)
  })

  React.useEffect(() => {
    if (scene) {
      setIsLoading(false)
    }
  }, [scene])

  // Apply shadow properties to all meshes and setup animations
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Setup animations if available
      if (animations && animations.length > 0) {
        const mixer = new (require('three').AnimationMixer)(scene)
        mixerRef.current = mixer
        animationsRef.current = animations

        // Play all animations
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip)
          action.play()
        })
      }
    }
  }, [scene, animations])

  // Update animations on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  if (hasError) {
    return (
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    )
  }

  if (isLoading) {
    return (
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    )
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  )
})

GLTFModel.displayName = 'GLTFModel'
