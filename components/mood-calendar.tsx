"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

interface MoodCalendarProps {
  moods: Mood[]
  onDayClick: (date: Date, moods: Mood[]) => void
}

const emotionColors: Record<string, string> = {
  happy: "bg-neon-lime",
  sad: "bg-electric-blue",
  anxious: "bg-neon-coral",
  calm: "bg-neon-lime",
  angry: "bg-neon-coral",
  excited: "bg-neon-lime",
}

export function MoodCalendar({ moods, onDayClick }: MoodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay()

  // Group moods by date
  const moodsByDate = moods.reduce(
    (acc, mood) => {
      const date = format(new Date(mood.created_at), "yyyy-MM-dd")
      if (!acc[date]) acc[date] = []
      acc[date].push(mood)
      return acc
    },
    {} as Record<string, Mood[]>,
  )

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white text-3xl">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10 bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-cyber-text py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Calendar Days */}
        {daysInMonth.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayMoods = moodsByDate[dateKey] || []
          const hasMoods = dayMoods.length > 0
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(day, dayMoods)}
              className={cn(
                "aspect-square p-2 rounded-lg border transition-all relative",
                isToday && "ring-2 ring-neon-lime",
                hasMoods
                  ? "border-neon-lime/30 bg-cyber-dark/50 hover:bg-cyber-dark/70"
                  : "border-cyber-text/10 bg-cyber-darker/30 hover:bg-cyber-dark/30",
              )}
            >
              <span className={cn("text-sm font-medium", hasMoods ? "text-white" : "text-cyber-text")}>
                {format(day, "d")}
              </span>
              {hasMoods && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayMoods.slice(0, 3).map((mood, i) => (
                    <div
                      key={i}
                      className={cn("w-1.5 h-1.5 rounded-full", emotionColors[mood.emotion] || "bg-cyber-text")}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
