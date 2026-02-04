"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const displayName = formData.get("displayName") as string
  const accountType = formData.get("accountType") as string
  const professionalRole = formData.get("professionalRole") as string | null

  if (!email || !password || !displayName) {
    return { error: "All fields are required" }
  }

  if (accountType === "professional" && !professionalRole) {
    return { error: "Professional role is required for professional accounts" }
  }

  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.VERCEL_URL || "http://localhost:3000"}/home`,
      data: {
        display_name: displayName,
        account_type: accountType,
        professional_role: professionalRole || null,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (accountType === "professional") {
    return { userId: data.user?.id }
  } else {
    redirect("/home")
  }
}
