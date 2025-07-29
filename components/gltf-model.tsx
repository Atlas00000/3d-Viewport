"use client"

import React, { useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { Mesh, type Material } from "three" // Import Mesh and Material from three

interface GLTFModelProps {
  modelPath: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  displayColor: string // The color to apply based on selection/hover/base
  // Event handlers from SelectableWrapper
  onPointerOver: (event: any) => void
  onPointerOut: (event: any) => void
  onClick: (event: any) => void
  ref: React.Ref<Mesh> // Ref for the primitive
}

export const GLTFModel = React.forwardRef<Mesh, GLTFModelProps>(
  ({ modelPath, position, rotation, scale, displayColor, onPointerOver, onPointerOut, onClick }, ref) => {
    const { scene } = useGLTF(modelPath)

    useEffect(() => {
      // Traverse the scene to set castShadow/receiveShadow and apply color
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            // Apply the displayColor to the material
            // Note: This will override original GLTF material colors for simplicity
            // For more advanced material handling, you'd clone materials or use shaders.
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: Material) => {
                if ("color" in mat) {
                  ;(mat as any).color.set(displayColor)
                }
              })
            } else if ("color" in child.material) {
              ;(child.material as any).color.set(displayColor)
            }
          }
        }
      })
    }, [scene, displayColor]) // Re-run when scene or displayColor changes

    return (
      <primitive
        object={scene}
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        ref={ref}
      />
    )
  },
)

GLTFModel.displayName = "GLTFModel"
