import { createServerClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Handle auth errors
  if (error) {
    console.error("[v0] Auth callback error:", error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`,
    )
  }

  // Exchange code for session
  if (code) {
    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Configuration error`)
    }

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Code exchange error:", exchangeError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    // Get user to determine account type
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const accountType = user?.user_metadata?.account_type || "personal"

    // Redirect to appropriate dashboard
    const redirectPath = accountType === "professional" ? "/pro" : next
    return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
  }

  // No code provided - redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
