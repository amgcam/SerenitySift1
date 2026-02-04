import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateInviteToken, getInviteExpiry } from "@/lib/invite-token"
import { canAddPatient } from "@/lib/pro-tiers"

export async function POST(request: Request) {
  try {
    const { patientEmail, patientName, message } = await request.json()

    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection unavailable. Please configure Supabase to use this feature." },
        { status: 503 },
      )
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a professional
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_professional, pro_tier")
      .eq("id", user.id)
      .single()

    if (!profile?.is_professional) {
      return NextResponse.json({ error: "Not a professional account" }, { status: 403 })
    }

    const { count: currentPatientCount } = await supabase
      .from("patient_connections")
      .select("*", { count: "exact", head: true })
      .eq("professional_id", user.id)
      .eq("status", "active")

    const patientCount = currentPatientCount || 0
    const proTier = profile.pro_tier || "free"

    if (!canAddPatient(proTier, patientCount)) {
      return NextResponse.json(
        { error: "Client limit reached for your current plan. Please upgrade to add more clients." },
        { status: 403 },
      )
    }

    // Generate invite token
    const token = generateInviteToken()
    const expiresAt = getInviteExpiry()

    // Create invite link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const inviteLink = `${baseUrl}/invite/${token}`

    // Store invitation in database (we'll create the connection when patient accepts)
    // For now, we'll just return the link
    // In a real implementation, you'd store this in a pending_invites table

    console.log("[v0] Invite created:", { patientEmail, patientName, token, expiresAt, currentCount: patientCount })

    // TODO: Send email via email service (SendGrid, Resend, etc.)
    // await sendInviteEmail(patientEmail, patientName, inviteLink, message)

    return NextResponse.json({
      success: true,
      inviteLink,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Invite error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
