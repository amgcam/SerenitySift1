"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { MoodCard } from "@/components/mood-card"
import { Activity, TrendingUp, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoPage() {
  // Mock data for preview
  const mockMoods = [
    {
      id: "1",
      emotion: "happy",
      intensity: 8,
      note: "Had a great morning walk and coffee with a friend!",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      emotion: "calm",
      intensity: 7,
      note: "Meditation session went really well today.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      emotion: "excited",
      intensity: 9,
      note: "Got some amazing news about my project!",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-soft-cyan/20 to-soft-blue/20 border border-soft-cyan/30 rounded-lg p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-soft-cyan" />
              <div>
                <p className="font-semibold text-white">Demo Mode</p>
                <p className="text-sm text-soft-text">
                  This is a preview with sample data. Sign up to track your real moods!
                </p>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent mb-2">
            Welcome to SerenitySift
          </h1>
          <p className="text-soft-text">Here's what your wellness dashboard would look like</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Moods" value="24" icon={Activity} trend="+3 this week" />
          <StatCard title="Current Streak" value="7 days" icon={TrendingUp} trend="Keep it up!" />
          <StatCard title="Active Challenges" value="3" icon={Target} trend="2 completed" />
          <StatCard title="Avg Intensity" value="7.2" icon={Sparkles} trend="+0.5 from last week" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Moods</h2>
            <Button asChild variant="ghost" className="text-soft-cyan hover:text-soft-cyan/80 hover:bg-soft-cyan/10">
              <Link href="/demo">View All</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {mockMoods.map((mood) => (
              <MoodCard
                key={mood.id}
                emotion={mood.emotion}
                intensity={mood.intensity}
                note={mood.note}
                createdAt={mood.created_at}
              />
            ))}
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-soft-text mb-4">Ready to start your wellness journey?</p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow"
          >
            <Link href="/auth/sign-up">Create Your Account</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
