"use client"

import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Plane, Grid } from "@react-three/drei"
import { SceneObject } from "@/types/scene"
import { SelectableWrapper } from "@/components/selectable-wrapper"
import { GLTFModel } from "@/components/gltf-model"
import { Box, Sphere } from "@react-three/drei"

interface SceneViewportProps {
  sceneObjects: SceneObject[]
  selectedObjectId: string | null
  onObjectSelect: (objectId: string | null) => void
  directionalLight: {
    color: string
    intensity: number
    position: [number, number, number]
    castShadow: boolean
    shadowMapSize: [number, number]
    shadowBias: number
  }
  pointLight: {
    color: string
    intensity: number
    position: [number, number, number]
  }
  environmentPreset: string
  showSidebar: boolean
  orbitControlsRef: React.RefObject<any>
}

export const SceneViewport: React.FC<SceneViewportProps> = ({
  sceneObjects,
  selectedObjectId,
  onObjectSelect,
  directionalLight,
  pointLight,
  environmentPreset,
  showSidebar,
  orbitControlsRef,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 75 }}
      shadows
      className={`absolute inset-0 transition-all duration-300 ease-in-out ${
        showSidebar ? "md:left-64" : "md:left-0"
      }`}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={directionalLight.position}
        intensity={directionalLight.intensity}
        color={directionalLight.color}
        castShadow={directionalLight.castShadow}
        shadow-mapSize-width={directionalLight.shadowMapSize[0]}
        shadow-mapSize-height={directionalLight.shadowMapSize[1]}
        shadow-bias={directionalLight.shadowBias}
      />
      <pointLight 
        position={pointLight.position} 
        intensity={pointLight.intensity} 
        color={pointLight.color} 
      />
      
      {/* Environment component for background and global illumination */}
      <Environment preset={environmentPreset as any} background />
      
      {/* Ground Plane */}
      <Plane args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial color="#cccccc" />
      </Plane>
      
      {/* Grid Helper */}
      <Grid
        renderOrder={-1}
        position={[0, -0.01, 0]}
        infiniteGrid
        cellSize={1}
        sectionSize={10}
        fadeDistance={50}
        followCamera
        sectionColor="#888888"
        cellColor="#bbbbbb"
      />
      
      {/* Render scene objects dynamically */}
      {sceneObjects.map((obj) => (
        <SelectableWrapper
          key={obj.id}
          id={obj.id}
          onSelect={onObjectSelect}
          isSelected={selectedObjectId === obj.id}
          baseColor={obj.materialColor}
        >
          {({ ref, onPointerOver, onPointerOut, onClick, displayColor }) =>
            obj.type === "box" ? (
              <Box
                ref={ref}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial
                  color={displayColor}
                  roughness={obj.roughness}
                  metalness={obj.metalness}
                  emissive={obj.emissive}
                  emissiveIntensity={obj.emissiveIntensity}
                  opacity={obj.opacity}
                  transparent={obj.opacity < 1}
                  wireframe={obj.wireframe}
                />
              </Box>
            ) : obj.type === "sphere" ? (
              <Sphere
                ref={ref}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial
                  color={displayColor}
                  roughness={obj.roughness}
                  metalness={obj.metalness}
                  emissive={obj.emissive}
                  emissiveIntensity={obj.emissiveIntensity}
                  opacity={obj.opacity}
                  transparent={obj.opacity < 1}
                  wireframe={obj.wireframe}
                />
              </Sphere>
            ) : (
              <GLTFModel
                ref={ref}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
                modelPath={obj.modelPath!}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                displayColor={displayColor}
              />
            )
          }
        </SelectableWrapper>
      ))}
      
      {/* Orbital Camera Controls */}
      <OrbitControls makeDefault ref={orbitControlsRef} />
    </Canvas>
  )
} 