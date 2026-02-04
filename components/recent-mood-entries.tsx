"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"
import { slideInRight } from "@/lib/animations"
import { useState } from "react"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

interface RecentMoodEntriesProps {
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

const getIntensityColor = (intensity: number) => {
  if (intensity >= 7) return "stroke-neon-lime"
  if (intensity <= 3) return "stroke-neon-coral"
  return "stroke-electric-blue"
}

export function RecentMoodEntries({ moods }: RecentMoodEntriesProps) {
  const [displayCount, setDisplayCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 5, moods.length))
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-white mb-4">Recent Entries</h3>

      <div
        className="space-y-3 max-h-[500px] overflow-y-auto pr-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {moods.slice(0, displayCount).map((mood, index) => (
          <motion.div
            key={mood.id}
            className="group relative bg-deep-purple/50 backdrop-blur-xl border border-soft-cyan/20 rounded-lg p-4 cursor-pointer hover:border-neon-lime/40 transition-all max-h-[150px]"
            variants={slideInRight}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,230,118,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-deep-purple/50"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    strokeWidth="2"
                    className={getIntensityColor(mood.intensity)}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: mood.intensity / 10 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl">
                  {emotionEmojis[mood.emotion] || "😐"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-electric-blue/20 text-electric-blue text-xs rounded-full">
                    {format(new Date(mood.created_at), "MMM d")}
                  </span>
                  <span className="text-soft-cyan text-xs capitalize">{mood.emotion}</span>
                </div>

                {mood.note && (
                  <p className="text-soft-text text-sm line-clamp-2 mb-2">
                    {mood.note.length > 60 ? `${mood.note.slice(0, 60)}...` : mood.note}
                  </p>
                )}
              </div>

              <motion.div
                className="flex-shrink-0 text-soft-cyan"
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        ))}

        {displayCount < moods.length && (
          <div className="flex justify-center py-4">
            {isLoading ? (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-electric-blue rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
                  />
                ))}
              </div>
            ) : (
              <button onClick={loadMore} className="text-soft-cyan text-sm hover:text-neon-lime transition-colors">
                Load more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
