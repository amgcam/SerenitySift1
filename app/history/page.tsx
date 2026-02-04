"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MoodCalendar } from "@/components/mood-calendar"
import { DayMoodsDialog } from "@/components/day-moods-dialog"
import { HistoryFilters } from "@/components/history-filters"
import { MoodTimeline } from "@/components/mood-timeline"
import { RecentMoodEntries } from "@/components/recent-mood-entries"
import { SentimentTrendGraph } from "@/components/sentiment-trend-graph"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animations"
import { QuickStatsSummary } from "@/components/quick-stats-summary"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

const demoMoods: Mood[] = [
  {
    id: "1",
    emotion: "happy",
    intensity: 8,
    note: "Great day at work!",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    emotion: "excited",
    intensity: 9,
    note: "Looking forward to the weekend",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    emotion: "calm",
    intensity: 7,
    note: "Meditation session",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    emotion: "anxious",
    intensity: 6,
    note: "Big presentation coming up",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    emotion: "happy",
    intensity: 8,
    note: "Dinner with friends",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    emotion: "sad",
    intensity: 4,
    note: "Missing family",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    emotion: "excited",
    intensity: 9,
    note: "Started new project",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    emotion: "calm",
    intensity: 7,
    note: "Peaceful morning",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function HistoryPage() {
  const [moods, setMoods] = useState<Mood[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    async function fetchMoods() {
      try {
        const supabase = createClient()

        if (!supabase) {
          console.log("[v0] Supabase client unavailable, using demo data")
          setMoods(demoMoods)
          setIsPreviewMode(true)
          setIsLoading(false)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setMoods(demoMoods)
          setIsPreviewMode(true)
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("moods")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (!error && data) {
          setMoods(data)
        }
        setIsLoading(false)
      } catch (error) {
        console.log("[v0] Supabase client unavailable, using demo data")
        setMoods(demoMoods)
        setIsPreviewMode(true)
        setIsLoading(false)
      }
    }

    fetchMoods()
  }, [])

  const handleDayClick = (date: Date, dayMoods: Mood[]) => {
    setSelectedDate(date)
    setSelectedMoods(dayMoods)
    setDialogOpen(true)
  }

  const filteredMoods = moods.filter((mood) => {
    const moodDate = new Date(mood.created_at)
    const now = new Date()

    switch (activeFilter) {
      case "week":
        return now.getTime() - moodDate.getTime() <= 7 * 24 * 60 * 60 * 1000
      case "month":
        return moodDate.getMonth() === now.getMonth() && moodDate.getFullYear() === now.getFullYear()
      case "3months":
        return now.getTime() - moodDate.getTime() <= 90 * 24 * 60 * 60 * 1000
      case "high":
        return mood.intensity >= 7
      default:
        return true
    }
  })

  return (
    <DashboardLayout>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 ios-scroll">
        <div className="mb-6">
          <h1 className="font-bold bg-gradient-to-r from-warm-orange via-soft-coral to-soft-purple bg-clip-text text-transparent md:text-4xl text-6xl">
            History
          </h1>
          <p className="text-soft-text text-sm mt-1">View your emotional journey over time</p>
          {isPreviewMode && (
            <div className="mt-4 p-3 bg-soft-cyan/10 border border-soft-cyan/20 rounded-lg">
              <p className="text-soft-cyan text-sm">
                Preview Mode: Viewing demo data. Connect Supabase to see your actual mood history.
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-soft-cyan" />
          </div>
        ) : (
          <>
            <HistoryFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <QuickStatsSummary moods={filteredMoods} />
            <MoodCalendar moods={filteredMoods} onDayClick={handleDayClick} />
            <SentimentTrendGraph moods={filteredMoods} />
            <MoodTimeline moods={filteredMoods.slice(0, 10)} />
            <RecentMoodEntries moods={filteredMoods.slice(0, 5)} />
          </>
        )}

        <DayMoodsDialog open={dialogOpen} onOpenChange={setDialogOpen} date={selectedDate} moods={selectedMoods} />
      </motion.div>
    </DashboardLayout>
  )
}
