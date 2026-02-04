import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProDashboardClient } from "@/components/pro-dashboard-client"

export default async function ProDashboardPage() {
  const supabase = await createServerClient()

  if (!supabase) {
    return (
      <ProDashboardClient
        professionalName="Demo Professional"
        professionalRole="Therapist"
        proTier="free"
        patients={[]}
      />
    )
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Get professional profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_professional, professional_role, pro_tier")
    .eq("id", user.id)
    .single()

  if (!profile?.is_professional) {
    redirect("/dashboard")
  }

  try {
    const { data: connections } = await supabase
      .from("patient_connections")
      .select("id, patient_id, status, connected_at")
      .eq("professional_id", user.id)
      .eq("status", "active")

    // Get mood data and profile for each patient
    const patientData = await Promise.all(
      (connections || []).map(async (conn) => {
        const { data: patientProfile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", conn.patient_id)
          .single()

        const { data: moods } = await supabase
          .from("moods")
          .select("emotion, intensity, created_at")
          .eq("user_id", conn.patient_id)
          .order("created_at", { ascending: false })
          .limit(10)

        // Calculate streak
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        let streak = 0
        const moodDates = new Set(moods?.map((m) => new Date(m.created_at).toDateString()) || [])

        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(checkDate.getDate() - i)
          if (moodDates.has(checkDate.toDateString())) {
            streak++
          } else {
            break
          }
        }

        return {
          id: conn.patient_id,
          name: patientProfile?.display_name || "Unknown",
          streak,
          recentMoods: moods || [],
          lastLog: moods?.[0]?.created_at || null,
        }
      }),
    )

    return (
      <ProDashboardClient
        professionalName={user.email?.split("@")[0] || "Professional"}
        professionalRole={profile.professional_role || "Professional"}
        proTier={profile.pro_tier || "free"}
        patients={patientData}
      />
    )
  } catch (error) {
    console.error("[v0] Pro dashboard error:", error)
    // Return demo data for preview on database errors
    return (
      <ProDashboardClient
        professionalName="Demo Professional"
        professionalRole="Therapist"
        proTier="free"
        patients={[]}
      />
    )
  }
}
