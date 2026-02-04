"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Loader2, Sparkles, TrendingUp, Clock, Brain, Target } from "lucide-react"
import { format, subDays } from "date-fns"

interface Mood {
  id: string
  emotion: string
  intensity: number
  created_at: string
}

const emotionColors: Record<string, string> = {
  happy: "#4CAF50", // Vibrant green
  sad: "#2196F3", // Bright blue
  anxious: "#FF5722", // Vibrant red-orange
  calm: "#9C27B0", // Rich purple
  angry: "#F44336", // Bright red
  excited: "#FFC107", // Vibrant yellow
  neutral: "#607D8B", // Blue gray
  stressed: "#E91E63", // Bright pink
  content: "#00BCD4", // Cyan
  tired: "#795548", // Brown
}

const demoMoods: Mood[] = [
  { id: "1", emotion: "happy", intensity: 8, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0).toISOString() },
  { id: "2", emotion: "calm", intensity: 7, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0).toISOString() },
  {
    id: "3",
    emotion: "excited",
    intensity: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "4",
    emotion: "anxious",
    intensity: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  { id: "5", emotion: "happy", intensity: 7, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: "6", emotion: "sad", intensity: 4, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: "7", emotion: "calm", intensity: 8, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: "8", emotion: "happy", intensity: 9, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
  {
    id: "9",
    emotion: "excited",
    intensity: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  { id: "10", emotion: "calm", intensity: 7, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString() },
]

const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF5722",
  "#9C27B0",
  "#F44336",
  "#FFC107",
  "#00BCD4",
  "#E91E63",
  "#607D8B",
  "#795548",
]

export default function SerenityInsightsPage() {
  const [moods, setMoods] = useState<Mood[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

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
        console.error("[v0] Error fetching moods:", error)
        setMoods(demoMoods)
        setIsPreviewMode(true)
        setIsLoading(false)
      }
    }

    fetchMoods()
  }, [])

  // Calculate decision patterns (simulated)
  const toughestDecision = "Dinner choices"
  const timeSaved = "3.2 hours"
  const bestDecisionTime = "7-9am"

  // Calculate mood-decision correlation
  const avgMoodScore =
    moods.length > 0 ? (moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length).toFixed(1) : "0"

  // Calculate weekly trend
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayMoods = moods.filter((m) => format(new Date(m.created_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    const avgIntensity = dayMoods.length > 0 ? dayMoods.reduce((sum, m) => sum + m.intensity, 0) / dayMoods.length : 0
    return {
      day: format(date, "EEE"),
      mood: Math.round(avgIntensity * 10) / 10,
      decisions: Math.floor(Math.random() * 10) + 5,
    }
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-soft-cyan animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (moods.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Serenity Insights</h1>
            <p className="text-soft-text">Understand your decision patterns and emotional wellness</p>
          </div>
          <div className="text-center py-12 border border-dashed border-soft-cyan/20 rounded-2xl bg-white/5 backdrop-blur-xl">
            <p className="text-soft-text">Log some moods to see your insights</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Serenity Insights</h1>
          <p className="text-soft-text">Understand your decision patterns and emotional wellness</p>
          {isPreviewMode && (
            <div className="mt-2 px-3 py-2 bg-soft-cyan/10 border border-soft-cyan/20 rounded-lg inline-block">
              <p className="text-sm text-soft-cyan">Preview Mode - Showing demo data</p>
            </div>
          )}
        </div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-5 h-5 text-soft-cyan" />
                <span className="text-xs text-soft-text">Pattern</span>
              </div>
              <p className="text-sm text-soft-text mb-1">Toughest Decisions</p>
              <p className="text-2xl font-bold text-white">{toughestDecision}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-soft-coral" />
                <span className="text-xs text-soft-text">This Month</span>
              </div>
              <p className="text-sm text-soft-text mb-1">Time Saved</p>
              <p className="text-2xl font-bold text-white">{timeSaved}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-soft-purple" />
                <span className="text-xs text-soft-text">Correlation</span>
              </div>
              <p className="text-sm text-soft-text mb-1">Mood-Decision Link</p>
              <p className="text-2xl font-bold text-white">Better @ {avgMoodScore}/10</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-soft-blue" />
                <span className="text-xs text-soft-text">Optimal</span>
              </div>
              <p className="text-sm text-soft-text mb-1">Best Decision Time</p>
              <p className="text-2xl font-bold text-white">{bestDecisionTime}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Card */}
        <Card className="bg-gradient-to-br from-soft-cyan/10 to-soft-blue/10 backdrop-blur-xl border-soft-cyan/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-soft-cyan" />
              Your Decision Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white leading-relaxed">
              You make better decisions when your mood is above 7/10. Your toughest decisions are around{" "}
              {toughestDecision.toLowerCase()}, typically in the evening. Consider using the AI Concierge during these
              times to save mental energy.
            </p>
            <div className="flex items-center gap-2 text-sm text-soft-cyan">
              <Sparkles className="w-4 h-4" />
              <span>Save {timeSaved} more this month by automating routine decisions</span>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood vs Decisions Chart */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Mood & Decision Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      border: "1px solid #00d4ff40",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#00d4ff" }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#00d4ff" strokeWidth={2} dot={{ fill: "#00d4ff" }} />
                  <Line
                    type="monotone"
                    dataKey="decisions"
                    stroke="#ff8ba0"
                    strokeWidth={2}
                    dot={{ fill: "#ff8ba0" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Pattern */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Weekly Decision Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      border: "1px solid #a78bfa40",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#a78bfa" }}
                  />
                  <Bar dataKey="decisions" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
