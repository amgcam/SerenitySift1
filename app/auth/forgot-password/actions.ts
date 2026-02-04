"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get("email") as string

  console.log("[v0] Password reset request for email:", email)

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const supabase = await createServerClient()

    if (!supabase) {
      console.error("[v0] Supabase client is null - credentials not configured")
      return {
        error:
          "Authentication service is not configured. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY environment variables are set.",
      }
    }

    const redirectUrl =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    console.log("[v0] Sending password reset email with redirect:", redirectUrl)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl}/auth/reset-password`,
    })

    if (error) {
      console.error("[v0] Password reset error:", error.message)
      return { error: error.message }
    }

    console.log("[v0] Password reset email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error in password reset:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred while sending the reset email",
    }
  }
}
