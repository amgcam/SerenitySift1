"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signOut() {
  const supabase = await createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  await supabase.auth.signOut()
  redirect("/auth/login")
}
