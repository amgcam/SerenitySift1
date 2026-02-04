import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfileClient } from "@/components/profile-client"

export default async function ProfilePage() {
  // Check authentication
  const supabase = await createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <ProfileClient user={user} profile={profile} />
}
