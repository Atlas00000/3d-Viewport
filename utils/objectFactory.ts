import { SceneObject } from "@/types/scene"

export const createBox = (id: string, name: string): SceneObject => ({
  id,
  name,
  type: "box",
  position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  materialColor: "#9b59b6",
  roughness: 0.5,
  metalness: 0,
  emissive: "#000000",
  emissiveIntensity: 0,
  opacity: 1,
  wireframe: false,
})

export const createSphere = (id: string, name: string): SceneObject => ({
  id,
  name,
  type: "sphere",
  position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  materialColor: "#f39c12",
  roughness: 0.5,
  metalness: 0,
  emissive: "#000000",
  emissiveIntensity: 0,
  opacity: 1,
  wireframe: false,
})

export const createGLTF = (id: string, name: string, modelPath?: string): SceneObject => ({
  id,
  name,
  type: "gltf",
  modelPath: modelPath || "/assets/3d/duck.glb",
  position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  materialColor: "#8e44ad",
  roughness: 0.5,
  metalness: 0,
  emissive: "#000000",
  emissiveIntensity: 0,
  opacity: 1,
  wireframe: false,
})

export const generateId = (): string => crypto.randomUUID()

export const generateName = (type: string, count: number): string => {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)
  return `${typeName} ${count}`
} 