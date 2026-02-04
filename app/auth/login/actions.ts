"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("[v0] Login attempt for email:", email)

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  let loginError: string | null = null
  let accountType: string | null = null

  try {
    const supabase = await createServerClient()

    if (!supabase) {
      console.error("[v0] Supabase client is null - credentials not configured")
      return {
        error:
          "Authentication service is not configured. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY environment variables are set.",
      }
    }

    console.log("[v0] Attempting sign in with Supabase")
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("[v0] Sign in result:", { hasData: !!data, hasError: !!error, errorMsg: error?.message })

    if (error) {
      if (error.message.includes("email_not_confirmed") || error.message.includes("Email not confirmed")) {
        loginError =
          "Please confirm your email address before logging in. Check your inbox for a confirmation link from Serenity Sift."
      } else if (error.message.includes("Invalid login credentials")) {
        loginError = "Invalid email or password. Please try again."
      } else {
        loginError = error.message
      }
    } else if (data.user) {
      accountType = data.user.user_metadata?.account_type || "personal"
      console.log("[v0] Login successful, account type:", accountType)
    }
  } catch (error) {
    console.error("[v0] Login error:", error)

    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      loginError =
        "Unable to connect to authentication service. Please check your internet connection and ensure Supabase is properly configured."
    } else {
      loginError = error instanceof Error ? error.message : "An unexpected error occurred during login"
    }
  }

  if (loginError) {
    console.log("[v0] Login failed:", loginError)
    return { error: loginError }
  }

  console.log("[v0] Redirecting to:", accountType === "professional" ? "/pro/dashboard" : "/home")

  if (accountType === "professional") {
    redirect("/pro/dashboard")
  } else {
    redirect("/home")
  }
}
