import { createServerClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  if (error) {
    console.error("[v0] Auth callback error:", error, errorDescription)

    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(
        errorDescription || error,
      )}`,
    )
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
  }

  const supabase = await createServerClient()

  if (!supabase) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(
        "Configuration error",
      )}`,
    )
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error("[v0] Code exchange error:", exchangeError)

    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(
        exchangeError.message,
      )}`,
    )
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}