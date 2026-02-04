import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProProfileClient } from "@/components/pro-profile-client"

export default async function ProProfilePage() {
  const supabase = await createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if user is professional
  const accountType = user.user_metadata?.account_type
  if (accountType !== "professional") {
    redirect("/home")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: clientCount } = await supabase
    .from("patient_connections")
    .select("*", { count: "exact", head: true })
    .eq("professional_id", user.id)
    .eq("status", "active")

  return (
    <ProProfileClient
      user={{
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.display_name || profile?.display_name || "Professional User",
        role: user.user_metadata?.professional_role || profile?.professional_role || "Professional",
        plan: profile?.pro_tier || "Free",
        clientsUsed: clientCount || 0,
        clientsLimit: profile?.pro_tier === "scope" ? 40 : profile?.pro_tier === "pro" ? 10 : 1,
      }}
    />
  )
}
