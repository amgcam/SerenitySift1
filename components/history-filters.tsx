"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { springConfigs } from "@/lib/animations"
import { useRef } from "react"

interface HistoryFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "3months", label: "Past 3 Months" },
  { id: "all", label: "All Time" },
  { id: "high", label: "High Intensity" },
]

export function HistoryFilters({ activeFilter, onFilterChange }: HistoryFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="flex-shrink-0 p-1 rounded-full bg-deep-purple/50 border border-soft-cyan/20 text-soft-cyan hover:bg-deep-purple/70 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-xs",
              "border backdrop-blur-xl relative overflow-hidden flex items-center justify-center",
              activeFilter === filter.id
                ? "bg-neon-coral/20 border-neon-coral text-white shadow-[0_0_15px_rgba(255,127,127,0.3)]"
                : "bg-deep-purple/50 border-soft-cyan/20 text-soft-text hover:border-soft-cyan/40",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              activeFilter === filter.id
                ? {
                    scale: [1, 1.05, 1],
                    transition: springConfigs.bouncy,
                  }
                : {}
            }
          >
            {filter.label}
            {activeFilter === filter.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="flex-shrink-0 p-1 rounded-full bg-deep-purple/50 border border-soft-cyan/20 text-soft-cyan hover:bg-deep-purple/70 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
