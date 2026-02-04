import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "This is an API endpoint. Please use POST method to create a professional account.",
    },
    { status: 405 },
  )
}

export async function POST(request: Request) {
  try {
    const { role, hasLicense } = await request.json()

    const supabase = await createServerClient()

    if (!supabase) {
      console.error("[v0] Supabase client unavailable")
      return NextResponse.json(
        { error: "Database unavailable. Please ensure Supabase is configured." },
        { status: 503 },
      )
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_professional: true,
        professional_role: role,
        pro_tier: "free",
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Failed to update profile:", updateError)
      return NextResponse.json({ error: "Failed to create professional account" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Pro onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
