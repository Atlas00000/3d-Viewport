export interface SceneObject {
  id: string
  name: string
  type: "box" | "sphere" | "gltf"
  modelPath?: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  materialColor: string
  roughness: number
  metalness: number
  emissive: string
  emissiveIntensity: number
  opacity: number
  wireframe: boolean
}

export interface LightState {
  color: string
  intensity: number
  position: [number, number, number]
}

export interface DirectionalLightState extends LightState {
  castShadow: boolean
  shadowMapSize: [number, number]
  shadowBias: number
}

export interface CameraState {
  position: [number, number, number]
  fov: number
  near: number
  far: number
}

export interface EnvironmentState {
  preset: string
  background: boolean
} 