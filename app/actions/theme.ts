"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTheme(userId: string, themeId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("profiles").update({ active_theme: themeId }).eq("id", userId)

  if (error) {
    throw new Error("Failed to update theme")
  }

  revalidatePath("/settings")
}
