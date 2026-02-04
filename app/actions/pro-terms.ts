"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function acceptProTerms(userId: string) {
  const supabase = await createServerClient()

  if (!supabase) {
    throw new Error("Supabase client not available")
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      pro_terms_accepted: true,
      pro_terms_version: "2025.11.03",
      pro_terms_accepted_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  )

  if (error) {
    console.error("Failed to save pro terms acceptance:", error)
    throw error
  }

  return { success: true }
}

export async function checkProTermsAccepted(userId: string): Promise<boolean> {
  const supabase = await createServerClient()

  if (!supabase) {
    return false
  }

  const { data } = await supabase.from("profiles").select("pro_terms_accepted").eq("id", userId).single()

  return data?.pro_terms_accepted === true
}
