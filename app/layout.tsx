import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'JungleQuest - 3D Animal Explorer',
  description: 'Explore amazing animals in 3D! Learn about wildlife through interactive models, sounds, and fun facts in our jungle-themed educational platform.',
  generator: 'JungleQuest',
  keywords: 'animals, 3D, education, jungle, wildlife, interactive, kids, learning',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', ${GeistSans.style.fontFamily}, sans-serif;
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="jungle-theme">{children}</body>
    </html>
  )
}
