import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProSettingsClient } from "@/components/pro-settings-client"

export default async function ProSettingsPage() {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect("/auth/login")
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_professional, professional_role, pro_tier")
      .eq("id", user.id)
      .single()

    if (!profile?.is_professional) {
      redirect("/dashboard")
    }

    // Get all patient connections for consent audit
    const { data: connections } = await supabase
      .from("patient_connections")
      .select(
        `
        id,
        patient_id,
        status,
        share_moods,
        share_notes,
        share_chats,
        connected_at,
        profiles:patient_id (display_name)
      `,
      )
      .eq("professional_id", user.id)

    // Get consent audit logs
    const { data: auditLogs } = await supabase
      .from("consent_audit")
      .select(
        `
        *,
        patient_connections (
          profiles:patient_id (display_name)
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50)

    return (
      <ProSettingsClient
        professionalRole={profile.professional_role || "Professional"}
        proTier={profile.pro_tier || "free"}
        connections={connections || []}
        auditLogs={auditLogs || []}
      />
    )
  } catch (error) {
    console.error("[v0] Pro settings error:", error)
    return <ProSettingsClient professionalRole="Professional" proTier="free" connections={[]} auditLogs={[]} />
  }
}
