"use client"

import { useEffect, useState } from "react"

export default function BackgroundElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Blobs animés */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 rounded-full blur-lg animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-200/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-200/20 rounded-full blur-xl animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "2s" }}
      />

      {/* Confettis SVG */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1200 800">
        <circle cx="100" cy="100" r="3" fill="#10b981" className="animate-pulse" />
        <circle cx="300" cy="200" r="2" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
        <circle cx="500" cy="150" r="4" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "1s" }} />
        <circle cx="700" cy="300" r="2" fill="#ec4899" className="animate-pulse" style={{ animationDelay: "1.5s" }} />
        <circle cx="900" cy="250" r="3" fill="#10b981" className="animate-pulse" style={{ animationDelay: "2s" }} />
        <circle cx="1100" cy="400" r="2" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "2.5s" }} />
        <circle cx="200" cy="500" r="4" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: "3s" }} />
        <circle cx="400" cy="600" r="3" fill="#ec4899" className="animate-pulse" style={{ animationDelay: "3.5s" }} />
        <circle cx="600" cy="550" r="2" fill="#10b981" className="animate-pulse" style={{ animationDelay: "4s" }} />
        <circle cx="800" cy="650" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: "4.5s" }} />
      </svg>
    </div>
  )
}
