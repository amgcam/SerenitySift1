import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PatientDetailClient } from "@/components/patient-detail-client"
import { use } from "react"

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return <PatientDetailClientWrapper patientId={id} />
}

async function PatientDetailClientWrapper({ patientId }: { patientId: string }) {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect("/auth/login")
    }

    // Verify professional has access to this patient
    const { data: connection } = await supabase
      .from("patient_connections")
      .select("*, profiles:patient_id(display_name)")
      .eq("professional_id", user.id)
      .eq("patient_id", patientId)
      .eq("status", "active")
      .single()

    if (!connection) {
      redirect("/pro")
    }

    // Get patient moods
    const { data: moods } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", patientId)
      .order("created_at", { ascending: false })
      .limit(100)

    // Get patient chats
    const { data: chats } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", patientId)
      .order("created_at", { ascending: false })
      .limit(50)

    return (
      <PatientDetailClient
        patientId={patientId}
        patientName={connection.profiles?.display_name || "Unknown"}
        moods={moods || []}
        chats={chats || []}
        shareSettings={{
          shareMoods: connection.share_moods,
          shareNotes: connection.share_notes,
          shareChats: connection.share_chats,
        }}
      />
    )
  } catch (error) {
    console.error("[v0] Patient detail error:", error)
    // Return demo data for preview
    return (
      <PatientDetailClient
        patientId={patientId}
        patientName="Demo Patient"
        moods={[]}
        chats={[]}
        shareSettings={{ shareMoods: true, shareNotes: true, shareChats: true }}
      />
    )
  }
}
