"use client"

import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}

export const LoadingOverlay: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <Loading size={size} text={text} />
      </div>
    </div>
  )
} 