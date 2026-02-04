import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MoodCard } from "@/components/mood-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Flame, PlusCircle, Crown, Zap, Sparkles } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  let user = null
  let profile = null
  let recentMoods = null
  let moodCount = 0
  let streak = 0
  let isPreviewMode = false

  const supabase = await createClient()

  if (!supabase) {
    isPreviewMode = true
  } else {
    const {
      data: { user: fetchedUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      if (userError.message?.includes("fetch") || userError.message?.includes("network")) {
        isPreviewMode = true
      } else {
        // Real auth error - redirect (must be outside try-catch per Next.js docs)
        redirect("/auth/login")
      }
    }

    if (fetchedUser) {
      user = fetchedUser

      try {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        profile = profileData

        const { data: moodsData } = await supabase
          .from("moods")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
        recentMoods = moodsData

        const { count } = await supabase
          .from("moods")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        moodCount = count || 0

        const today = new Date().toISOString().split("T")[0]
        const { data: todayMood } = await supabase
          .from("moods")
          .select("created_at")
          .eq("user_id", user.id)
          .gte("created_at", today)
          .limit(1)

        streak = todayMood && todayMood.length > 0 ? 1 : 0
      } catch (error) {
        console.error("[v0] Dashboard database error:", error)
        isPreviewMode = true
      }
    }
  }

  // Demo data for preview mode
  if (isPreviewMode) {
    profile = { display_name: "Demo User", subscription_status: "free" }
    recentMoods = [
      {
        id: "1",
        emotion: "happy",
        intensity: 8,
        note: "Had a great day at work!",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        emotion: "calm",
        intensity: 7,
        note: "Meditation session was peaceful",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        emotion: "excited",
        intensity: 9,
        note: "Got tickets to the concert!",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    moodCount = 24
    streak = 5
  }

  const isPremium = profile?.subscription_status === "premium"

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {isPreviewMode && (
          <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-2xl p-3 text-center backdrop-blur-xl">
            <p className="text-sm text-[#A5B4FC]">📱 Preview Mode - Sign up to save your real mood data</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-white text-3xl font-bold">Welcome back, {profile?.display_name || "Friend"}</h1>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white shrink-0">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-[#94A3B8] text-base">How are you feeling today?</p>
          <Button
            asChild
            className="bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white hover:opacity-90 shadow-[0_0_20px_rgba(0,212,255,0.6)] rounded-full px-6 py-3 touch-target w-full sm:w-auto font-medium"
          >
            <Link href="/log">
              <PlusCircle className="w-4 h-4 mr-2" />
              Log Mood
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dojo" className="group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all hover:border-soft-cyan/50 hover:shadow-soft-glow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-soft-cyan/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-soft-cyan" />
                </div>
                <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30">New</Badge>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Decision Dojo</h3>
              <p className="text-sm text-soft-text">Train your decision-making muscle with smart choices</p>
            </div>
          </Link>

          <Link href="/concierge" className="group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all hover:border-soft-coral/50 hover:shadow-warm-glow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-soft-coral/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-soft-coral" />
                </div>
                <Badge className="bg-warm-orange/20 text-warm-orange border-warm-orange/30">Premium</Badge>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Concierge</h3>
              <p className="text-sm text-soft-text">Let AI handle your decisions. Stop deciding. Start doing.</p>
            </div>
          </Link>
        </div>

        {!isPremium && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-[#00D4FF]" />
                  <h3 className="font-medium text-[#00D4FF]">Unlock Premium Features</h3>
                </div>
                <p className="text-sm text-[#94A3B8] mb-3">
                  Get in-depth AI feedback, unlimited custom emotions, and exportable data
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white hover:opacity-90 rounded-full px-6 font-medium"
                >
                  <Link href="/subscription">Upgrade for $4.99/month</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Calendar className="w-5 h-5 text-[#00D4FF]" />
              <span className="text-xs text-[#94A3B8]">All Time</span>
            </div>
            <div className="text-3xl font-medium text-white">{moodCount || 0}</div>
            <div className="text-sm text-[#A5B4FC]">Total Entries</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5 fire-streak" />
              <span className="text-xs text-[#94A3B8]">Days</span>
            </div>
            <div className="text-3xl font-medium text-white">{streak}</div>
            <div className="text-sm text-[#A5B4FC]">Streak</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
              <span className="text-xs text-[#94A3B8]">7 Days</span>
            </div>
            <div className="text-3xl font-medium text-white">{recentMoods?.length || 0}</div>
            <div className="text-sm text-[#A5B4FC]">This Week</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-white">Recent Moods</h2>
            <Button asChild variant="ghost" className="text-[#00D4FF] hover:text-[#00D4FF]/80 hover:bg-[#00D4FF]/10">
              <Link href="/history">View All</Link>
            </Button>
          </div>

          {recentMoods && recentMoods.length > 0 ? (
            <div className="space-y-3">
              {recentMoods.map((mood) => (
                <MoodCard
                  key={mood.id}
                  emotion={mood.emotion}
                  intensity={mood.intensity}
                  note={mood.note}
                  createdAt={mood.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#00D4FF]/20 rounded-2xl bg-white/5 backdrop-blur-xl">
              <p className="text-[#94A3B8] mb-4">No moods logged yet</p>
              <Button
                asChild
                className="bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white hover:opacity-90 rounded-full px-6"
              >
                <Link href="/log">Log Your First Mood</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
