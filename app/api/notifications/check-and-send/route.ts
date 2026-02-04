import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getNextNotificationMessage } from "@/lib/notification-messages"

// This endpoint would be called by a cron job or scheduled function
// For example: Vercel Cron Jobs, AWS Lambda, or similar
export async function POST(request: Request) {
  try {
    // Verify the request is from a trusted source (e.g., cron job secret)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()

    // Get all users with notifications enabled
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, notification_enabled, notification_time, notification_skip_weekends, notification_message_history")
      .eq("notification_enabled", true)

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    const results = []

    for (const profile of profiles || []) {
      // Check if user has logged mood today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: todayMoods } = await supabase
        .from("moods")
        .select("id")
        .eq("user_id", profile.id)
        .gte("created_at", today.toISOString())

      // Skip if user already logged mood today
      if (todayMoods && todayMoods.length > 0) {
        continue
      }

      // Check if it's weekend and user wants to skip weekends
      const dayOfWeek = new Date().getDay()
      if (profile.notification_skip_weekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
        continue
      }

      // Get next message
      const messageHistory = (profile.notification_message_history as number[]) || []
      const { message, index } = getNextNotificationMessage(messageHistory)

      // Update message history
      const updatedHistory = [...messageHistory, index].slice(-10) // Keep last 10

      await supabase
        .from("profiles")
        .update({
          notification_message_history: updatedHistory,
          notification_last_sent: new Date().toISOString(),
        })
        .eq("id", profile.id)

      // Log the notification
      await supabase.from("notification_logs").insert({
        user_id: profile.id,
        message_index: index,
      })

      // Here you would send the actual push notification
      // For example, using Firebase Cloud Messaging, OneSignal, or Web Push API
      // await sendPushNotification(profile.id, message)

      results.push({
        userId: profile.id,
        message,
        sent: true,
      })
    }

    return NextResponse.json({
      success: true,
      notificationsSent: results.length,
      results,
    })
  } catch (error) {
    console.error("[v0] Error in notification check-and-send:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
