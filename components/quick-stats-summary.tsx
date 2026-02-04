"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { animateNumber } from "@/lib/animations"

interface Mood {
  id: string
  emotion: string
  intensity: number
  created_at: string
}

interface QuickStatsSummaryProps {
  moods: Mood[]
}

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  calm: "😌",
  angry: "😠",
  excited: "🤩",
}

export function QuickStatsSummary({ moods }: QuickStatsSummaryProps) {
  const [totalCount, setTotalCount] = useState(0)
  const [avgIntensity, setAvgIntensity] = useState(0)

  const thisMonthMoods = moods.filter((mood) => {
    const moodDate = new Date(mood.created_at)
    const now = new Date()
    return moodDate.getMonth() === now.getMonth() && moodDate.getFullYear() === now.getFullYear()
  })

  const avgIntensityValue = moods.length > 0 ? moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length : 0

  const emotionCounts = moods.reduce(
    (acc, mood) => {
      acc[mood.emotion] = (acc[mood.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostFrequent = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "happy"

  useEffect(() => {
    animateNumber(0, thisMonthMoods.length, 1, setTotalCount)
    animateNumber(0, avgIntensityValue, 1.2, setAvgIntensity)
  }, [thisMonthMoods.length, avgIntensityValue])

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Total logs */}
      <motion.div
        className="bg-deep-purple/50 backdrop-blur-xl border border-soft-cyan/20 rounded-lg p-3 text-center h-20 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.p
          className="text-2xl font-bold text-neon-lime"
          key={totalCount}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {Math.round(totalCount)}
        </motion.p>
        <p className="text-soft-text text-xs mt-0.5">moods logged</p>
      </motion.div>

      {/* Average intensity */}
      <motion.div
        className="bg-deep-purple/50 backdrop-blur-xl border border-soft-cyan/20 rounded-lg p-3 text-center h-20 flex flex-col items-center justify-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-deep-purple"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              strokeWidth="3"
              className="text-electric-blue"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: avgIntensityValue / 10 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div>
            <p className="text-xl font-bold text-white">{avgIntensity.toFixed(1)}</p>
            <p className="text-soft-text text-xs">avg intensity</p>
          </div>
        </div>
      </motion.div>

      {/* Most frequent mood */}
      <motion.div
        className="bg-deep-purple/50 backdrop-blur-xl border border-soft-cyan/20 rounded-lg p-3 text-center h-20 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          className="text-3xl inline-block"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2,
          }}
        >
          {emotionEmojis[mostFrequent] || "😐"}
        </motion.span>
        <p className="text-soft-text text-xs mt-0.5 capitalize">{mostFrequent}</p>
      </motion.div>
    </div>
  )
}
