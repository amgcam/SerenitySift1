"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string

  console.log("[v0] Password reset attempt")

  if (!password) {
    return { error: "Password is required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
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

    console.log("[v0] Attempting to update user password")

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error("[v0] Password update error:", error.message)
      return { error: error.message }
    }

    console.log("[v0] Password updated successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error in password reset:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred while updating the password",
    }
  }
}
