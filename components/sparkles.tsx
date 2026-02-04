"use client"

import { motion } from "framer-motion"
import { sparkleAnimation } from "@/lib/animations"

interface SparklesProps {
  count?: number
  color?: string
}

export function Sparkles({ count = 6, color = "bg-soft-coral" }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {sparkles.map((index) => {
        const angle = (index / count) * Math.PI * 2
        const distance = 30
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        return (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 rounded-full ${color}`}
            style={{ left: "50%", top: "50%", marginLeft: -4, marginTop: -4 }}
            initial={{ ...sparkleAnimation.initial, x, y }}
            animate={sparkleAnimation.animate}
          />
        )
      })}
    </>
  )
}
