import React from 'react'

/**
 * Simple debounce utility for optimizing frequent updates
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Hook for creating a debounced callback
 * @param callback The callback to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the callback
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  return React.useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  )
} 