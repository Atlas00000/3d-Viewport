"use client"

import type React from "react"
import { useRef, useState, useCallback } from "react"
import type { Mesh } from "three"

interface SelectableWrapperProps {
  id: string
  onSelect: (objectId: string | null) => void
  isSelected: boolean
  baseColor: string // The object's base color from its state
  children: (props: {
    ref: React.Ref<Mesh>
    onPointerOver: (event: any) => void
    onPointerOut: (event: any) => void
    onClick: (event: any) => void
    displayColor: string // The color to apply based on selection/hover/base
  }) => React.ReactNode
}

export function SelectableWrapper({ id, onSelect, isSelected, baseColor, children }: SelectableWrapperProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHover] = useState(false)

  const handleClick = useCallback(
    (event: any) => {
      event.stopPropagation() // Prevent event from bubbling up to the canvas
      onSelect(isSelected ? null : id) // Toggle selection
    },
    [id, onSelect, isSelected],
  )

  // Determine the color to display based on selection, hover, or base color
  const displayColor = isSelected ? "#f1c40f" : hovered ? "#bdc3c7" : baseColor

  return children({
    ref: meshRef,
    onPointerOver: (event) => {
      event.stopPropagation()
      setHover(true)
    },
    onPointerOut: () => setHover(false),
    onClick: handleClick,
    displayColor: displayColor,
  })
}
