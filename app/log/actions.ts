"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function logMood(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const emotion = formData.get("emotion") as string
  const intensity = Number.parseInt(formData.get("intensity") as string)
  const note = formData.get("note") as string

  if (!emotion || !intensity) {
    return { error: "Emotion and intensity are required" }
  }

  const { error } = await supabase.from("moods").insert({
    user_id: user.id,
    emotion,
    intensity,
    note: note || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
