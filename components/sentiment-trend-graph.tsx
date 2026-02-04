"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Mood {
  id: string
  emotion: string
  intensity: number
  created_at: string
}

interface SentimentTrendGraphProps {
  moods: Mood[]
}

const positiveEmotions = ["happy", "excited", "calm"]

export function SentimentTrendGraph({ moods }: SentimentTrendGraphProps) {
  // Calculate 7-day rolling average sentiment
  const sentimentData = moods.slice(0, 7).map((mood) => {
    const isPositive = positiveEmotions.includes(mood.emotion)
    return isPositive ? mood.intensity : -mood.intensity
  })

  const avgSentiment = sentimentData.reduce((a, b) => a + b, 0) / sentimentData.length
  const trend = avgSentiment > 2 ? "improving" : avgSentiment < -2 ? "declining" : "stable"

  const maxValue = Math.max(...sentimentData.map(Math.abs))
  const points = sentimentData
    .map((value, index) => {
      const x = (index / (sentimentData.length - 1)) * 100
      const y = 50 - (value / maxValue) * 40
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Sentiment Trend</h3>

        {/* Trend indicator */}
        <motion.div
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
            trend === "improving" && "bg-neon-lime/20 text-neon-lime",
            trend === "declining" && "bg-neon-coral/20 text-neon-coral",
            trend === "stable" && "bg-electric-blue/20 text-electric-blue",
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {trend === "improving" && <TrendingUp className="w-4 h-4" />}
          {trend === "declining" && <TrendingDown className="w-4 h-4" />}
          {trend === "stable" && <Minus className="w-4 h-4" />}
          <span className="capitalize">{trend}</span>
        </motion.div>
      </div>

      {/* Graph */}
      <div className="relative h-32 bg-deep-purple/30 backdrop-blur-xl border border-soft-cyan/20 rounded-lg p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-soft-text/20" />

          {/* Area fill */}
          <motion.path
            d={`M 0,50 L ${points} L 100,50 Z`}
            fill="url(#sentiment-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />

          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={trend === "improving" ? "#00E676" : trend === "declining" ? "#FF7F7F" : "#00C4FF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E676" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#00C4FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF7F7F" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p className="text-soft-text text-sm text-center">7-day rolling average</p>
    </div>
  )
}
