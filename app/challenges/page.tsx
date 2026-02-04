import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChallengeCard } from "@/components/challenge-card"
import { CreateChallengeDialog } from "@/components/create-challenge-dialog"
import { Target } from "lucide-react"

export default async function ChallengesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-lime mb-2">Wellness Goals</h1>
            <p className="text-cyber-text">Build healthy habits with daily challenges</p>
          </div>
          <CreateChallengeDialog />
        </div>

        {challenges && challenges.length > 0 ? (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                id={challenge.id}
                title={challenge.title}
                description={challenge.description}
                frequency={challenge.frequency}
                completedDates={(challenge.completed_dates as string[]) || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-neon-lime/20 rounded-lg">
            <Target className="w-16 h-16 text-neon-lime mx-auto mb-4 opacity-50" />
            <p className="text-cyber-text mb-4">No challenges yet</p>
            <CreateChallengeDialog />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
