import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsClient } from "@/components/settings-client"

export default async function SettingsPage() {
  const supabase = await createServerClient()

  // Redirect to login if Supabase not configured or user not authenticated
  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <SettingsClient user={user} profile={profile} />
}
