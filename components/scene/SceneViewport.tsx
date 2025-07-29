"use client"

import React, { memo } from "react"
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
  onInfoClick?: () => void
}

export const SceneViewport: React.FC<SceneViewportProps> = memo(({
  sceneObjects,
  selectedObjectId,
  onObjectSelect,
  directionalLight,
  pointLight,
  environmentPreset,
  showSidebar,
  orbitControlsRef,
  onInfoClick,
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Jungle-themed overlay elements */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-green-800/80 backdrop-blur-sm rounded-lg p-2 text-white text-xs font-bold border border-green-600">
          🦁 3D Animal Explorer
        </div>
      </div>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg p-3 text-green-900 text-sm font-bold border-2 border-yellow-400 max-w-xs">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">💡</span>
            <span>Tips:</span>
          </div>
          <ul className="text-xs space-y-1">
            <li>• Click objects to select them</li>
            <li>• Drag to rotate the view</li>
            <li>• Scroll to zoom in/out</li>
          </ul>
        </div>
      </div>



      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        shadows
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          showSidebar ? "md:left-72" : "md:left-0"
        }`}
        style={{
          background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #90EE90 100%)'
        }}
      >
        {/* Enhanced Lighting for jungle theme */}
        <ambientLight intensity={0.6} color="#f0f8f0" />
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
        <Environment 
          files="/assets/snowenvrion_1k.hdr"
          background 
        />

        {/* Arctic Terrain Floor */}
        <GLTFModel
          modelPath="/assets/arctic_terrain1.glb"
          position={[0, -0.5, 0]}
          rotation={[0, 0, 0]}
          scale={[0.05, 0.05, 0.05]}
          displayColor="#ffffff"
        />

        {/* Polar Bear Model */}
        <GLTFModel
          modelPath="/assets/polar_bear.glb"
          position={[0, 0.9, 0]}
          rotation={[0, 0, 0]}
          scale={[0.5, 0.5, 0.5]}
          displayColor="#ffffff"
        />

        {/* Enhanced Grid Helper with jungle colors */}
        <Grid
          renderOrder={-1}
          position={[0, -0.01, 0]}
          infiniteGrid
          cellSize={1}
          sectionSize={10}
          fadeDistance={50}
          followCamera
          sectionColor="#556B2F"
          cellColor="#8FBC8F"
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

        {/* Enhanced Orbital Camera Controls */}
        <OrbitControls 
          makeDefault 
          ref={orbitControlsRef}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={15}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
})

SceneViewport.displayName = 'SceneViewport' 