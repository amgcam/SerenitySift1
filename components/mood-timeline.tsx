"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { staggerContainer, staggerItem } from "@/lib/animations"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

interface MoodTimelineProps {
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

const getSentimentColor = (emotion: string, intensity: number) => {
  const positiveEmotions = ["happy", "excited", "calm"]
  const negativeEmotions = ["sad", "angry", "anxious"]

  if (positiveEmotions.includes(emotion)) {
    return intensity >= 7 ? "bg-neon-lime" : "bg-soft-cyan"
  } else if (negativeEmotions.includes(emotion)) {
    return intensity >= 7 ? "bg-neon-coral" : "bg-soft-coral"
  }
  return "bg-electric-blue"
}

export function MoodTimeline({ moods }: MoodTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative">
      <h3 className="text-lg font-bold text-white mb-4">Mood Timeline</h3>

      <div className="relative flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          className="flex-shrink-0 p-2 rounded-full bg-deep-purple/50 border border-neon-lime/20 text-neon-lime hover:bg-deep-purple/70 transition-colors z-10"
          aria-label="Scroll timeline left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1 overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-deep-navy to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-deep-navy to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <motion.div
              className="flex items-center gap-6 min-w-max px-4 py-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Connecting line */}
              <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 pointer-events-none">
                <motion.path
                  d={`M 0 0 Q ${moods.length * 40} 15 ${moods.length * 80} 0`}
                  stroke="url(#timeline-gradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF7F7F" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#00E676" />
                  </linearGradient>
                </defs>
              </svg>

              {moods.map((mood, index) => {
                const size = 16 + mood.intensity * 2
                const isHovered = hoveredId === mood.id

                return (
                  <motion.div
                    key={mood.id}
                    className="relative flex flex-col items-center z-10"
                    variants={staggerItem}
                    onHoverStart={() => setHoveredId(mood.id)}
                    onHoverEnd={() => setHoveredId(null)}
                  >
                    {/* Mood dot */}
                    <motion.div
                      className={cn(
                        "rounded-full cursor-pointer relative flex items-center justify-center",
                        getSentimentColor(mood.emotion, mood.intensity),
                      )}
                      style={{ width: size, height: size }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        isHovered
                          ? {
                              boxShadow: [
                                "0 0 0 0 rgba(255,127,127,0.4)",
                                "0 0 0 8px rgba(255,127,127,0)",
                                "0 0 0 0 rgba(255,127,127,0)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.6, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <span className="text-xs">{emotionEmojis[mood.emotion] || "😐"}</span>
                    </motion.div>

                    {/* Date label */}
                    <p className="text-soft-text text-xs mt-2">{format(new Date(mood.created_at), "MMM d")}</p>

                    {/* Tooltip */}
                    {isHovered && (
                      <motion.div
                        className="absolute top-full mt-8 bg-deep-purple/90 backdrop-blur-xl border border-soft-cyan/30 rounded-lg p-3 min-w-[180px] shadow-soft-glow"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <p className="text-white font-medium text-sm">
                          {format(new Date(mood.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-soft-cyan text-xs capitalize">
                          {mood.emotion} • {mood.intensity}/10
                        </p>
                        {mood.note && <p className="text-soft-text text-xs mt-1">{mood.note.slice(0, 50)}...</p>}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          className="flex-shrink-0 p-2 rounded-full bg-deep-purple/50 border border-neon-lime/20 text-neon-lime hover:bg-deep-purple/70 transition-colors z-10"
          aria-label="Scroll timeline right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
