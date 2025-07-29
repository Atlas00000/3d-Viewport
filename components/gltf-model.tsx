"use client"

import React, { forwardRef, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"
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

  const { scene } = useGLTF(modelPath, true, true, (error) => {
    console.error('Error loading GLTF model:', error)
    setHasError(true)
    setIsLoading(false)
  })

  React.useEffect(() => {
    if (scene) {
      setIsLoading(false)
    }
  }, [scene])

  // Apply shadow properties to all meshes
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

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
