# Quick Start Guide - Phase 1 Implementation

## Immediate Actions (Today)

### 1. Create Directory Structure
```bash
mkdir -p hooks services types utils constants
mkdir -p components/scene components/controls
```

### 2. Start with Hook Extraction (Priority 1)

#### Create `hooks/useSceneObjects.ts`
```typescript
import { useState, useCallback } from 'react'
import { SceneObject } from '@/types/scene'

export const useSceneObjects = () => {
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([])
  
  const addObject = useCallback((object: SceneObject) => {
    setSceneObjects(prev => [...prev, object])
  }, [])
  
  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    setSceneObjects(prev => 
      prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    )
  }, [])
  
  const deleteObject = useCallback((id: string) => {
    setSceneObjects(prev => prev.filter(obj => obj.id !== id))
  }, [])
  
  return {
    sceneObjects,
    addObject,
    updateObject,
    deleteObject,
  }
}
```

#### Create `hooks/useObjectSelection.ts`
```typescript
import { useState, useCallback } from 'react'

export const useObjectSelection = () => {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  
  const selectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id)
  }, [])
  
  const clearSelection = useCallback(() => {
    setSelectedObjectId(null)
  }, [])
  
  return {
    selectedObjectId,
    selectObject,
    clearSelection,
  }
}
```

### 3. Create Type Definitions

#### Create `types/scene.ts`
```typescript
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
```

### 4. Remove Duplicate Component

#### Delete `components/selectable-mesh.tsx`
```bash
rm components/selectable-mesh.tsx
```

### 5. Improve Type Safety

#### Update `components/selectable-wrapper.tsx`
```typescript
import { ThreeEvent } from '@react-three/fiber'

interface SelectableWrapperProps {
  id: string
  onSelect: (objectId: string | null) => void
  isSelected: boolean
  baseColor: string
  children: (props: {
    ref: React.Ref<Mesh>
    onPointerOver: (event: ThreeEvent<PointerEvent>) => void
    onPointerOut: (event: ThreeEvent<PointerEvent>) => void
    onClick: (event: ThreeEvent<PointerEvent>) => void
    displayColor: string
  }) => React.ReactNode
}
```

## Week 1 Goals

### Day 1-2: Hook Extraction
- [ ] Extract `useSceneObjects`
- [ ] Extract `useObjectSelection`
- [ ] Extract `useSceneHistory`
- [ ] Extract `useLighting`
- [ ] Extract `useCamera`

### Day 3-4: Component Splitting
- [ ] Create `SceneViewport.tsx`
- [ ] Create `SceneControls.tsx`
- [ ] Create `ObjectProperties.tsx`
- [ ] Create `LightingControls.tsx`
- [ ] Create `CameraControls.tsx`

### Day 5: Cleanup
- [ ] Remove duplicate components
- [ ] Improve type safety
- [ ] Test all extracted hooks
- [ ] Update main component to use new structure

## Success Checklist

### Phase 1 Complete When:
- [ ] Main component is <300 lines
- [ ] All business logic is in hooks
- [ ] No duplicate selection components exist
- [ ] All `any` types are replaced
- [ ] Components have single responsibilities
- [ ] Tests pass for all hooks

## Next Steps After Phase 1

1. **Phase 2**: Implement Scene Manager Service
2. **Phase 3**: Add Performance Optimizations
3. **Phase 4**: Enhance User Experience

## Development Tips

### Follow Commandments
- **Keep it simple**: Don't overthink the implementation
- **Stay within scope**: Focus on current phase only
- **Modular approach**: Each hook/component has one job
- **No overengineering**: Use existing patterns

### Testing Strategy
```typescript
// hooks/__tests__/useSceneObjects.test.ts
import { renderHook, act } from '@testing-library/react'
import { useSceneObjects } from '../useSceneObjects'

test('should add object', () => {
  const { result } = renderHook(() => useSceneObjects())
  
  act(() => {
    result.current.addObject(mockObject)
  })
  
  expect(result.current.sceneObjects).toHaveLength(1)
})
```

### Git Workflow
```bash
# For each feature
git checkout -b feature/extract-useSceneObjects
# Make changes
git add .
git commit -m "feat: extract useSceneObjects hook"
git push origin feature/extract-useSceneObjects
# Create PR
```

## Common Issues & Solutions

### Issue: Hook Dependencies
**Solution**: Use `useCallback` and `useMemo` appropriately
```typescript
const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
  // Implementation
}, []) // Empty dependency array if no external dependencies
```

### Issue: Type Errors
**Solution**: Create proper type definitions
```typescript
// types/events.ts
export type SceneEvent = ThreeEvent<PointerEvent>
```

### Issue: Component Re-renders
**Solution**: Use React.memo for expensive components
```typescript
export const SceneObject = React.memo(({ object, onSelect }) => {
  // Component implementation
})
```

## Ready to Start?

1. **Create the directory structure**
2. **Start with `useSceneObjects` hook**
3. **Test as you go**
4. **Commit frequently**
5. **Follow the commandments**

**Remember**: Start simple, test often, and keep it modular! 