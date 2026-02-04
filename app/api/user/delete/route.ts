import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete user profile data
    await supabase.from("profiles").delete().eq("id", user.id)

    // Delete mood entries
    await supabase.from("mood_entries").delete().eq("user_id", user.id)

    // Delete AI chat history
    await supabase.from("ai_chats").delete().eq("user_id", user.id)

    // Delete patient connections (for professionals)
    await supabase.from("patient_connections").delete().eq("professional_id", user.id)
    await supabase.from("patient_connections").delete().eq("patient_id", user.id)

    // Delete the user account from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
    }

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
