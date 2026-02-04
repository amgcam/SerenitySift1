"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createChallenge(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const frequency = formData.get("frequency") as string

  if (!title || !frequency) {
    return { error: "Title and frequency are required" }
  }

  const { error } = await supabase.from("challenges").insert({
    user_id: user.id,
    title,
    description: description || null,
    frequency,
    completed_dates: [],
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/challenges")
  return { success: true }
}

export async function toggleChallengeCompletion(challengeId: string, date: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch current challenge
  const { data: challenge, error: fetchError } = await supabase
    .from("challenges")
    .select("completed_dates")
    .eq("id", challengeId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !challenge) {
    return { error: "Challenge not found" }
  }

  const completedDates = (challenge.completed_dates as string[]) || []
  const isCompleted = completedDates.includes(date)

  const updatedDates = isCompleted ? completedDates.filter((d) => d !== date) : [...completedDates, date]

  const { error } = await supabase
    .from("challenges")
    .update({ completed_dates: updatedDates })
    .eq("id", challengeId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/challenges")
  return { success: true }
}

export async function deleteChallenge(challengeId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { error } = await supabase.from("challenges").delete().eq("id", challengeId).eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/challenges")
  return { success: true }
}
