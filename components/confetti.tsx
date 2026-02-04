"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { confettiParticle } from "@/lib/animations"

interface ConfettiProps {
  count?: number
  duration?: number
  onComplete?: () => void
}

export function Confetti({ count = 20, duration = 2000, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    setParticles(Array.from({ length: count }, (_, i) => i))

    const timer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [count, duration, onComplete])

  const colors = ["bg-soft-orange", "bg-soft-coral", "bg-soft-purple", "bg-soft-blue", "bg-soft-cyan"]

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((index) => (
        <motion.div
          key={index}
          className={`absolute w-3 h-3 rounded-full ${colors[index % colors.length]}`}
          {...confettiParticle(index)}
        />
      ))}
    </div>
  )
}
