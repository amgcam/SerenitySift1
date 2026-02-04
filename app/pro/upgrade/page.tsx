import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProUpgradeClient } from "@/components/pro-upgrade-client"

export default async function ProUpgradePage() {
  const supabase = await createServerClient()

  if (!supabase) {
    // Preview mode without Supabase - show demo
    return <ProUpgradeClient currentTier="free" />
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_professional, pro_tier")
      .eq("id", user.id)
      .single()

    if (!profile?.is_professional) {
      redirect("/dashboard")
    }

    return <ProUpgradeClient currentTier={profile.pro_tier || "free"} />
  } catch (error) {
    console.error("[v0] Pro upgrade page error:", error)
    // Return demo data if database query fails
    return <ProUpgradeClient currentTier="free" />
  }
}
