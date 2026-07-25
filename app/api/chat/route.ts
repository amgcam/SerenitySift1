import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Must be logged in" }, { status: 401 })
  }

  // Hard-coded limit for testing
  const today = new Date().toISOString().split('T')[0]

  const { data: usage } = await supabase
    .from('chat_usage')
    .select('message_count')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  const count = usage?.message_count || 0

  if (count >= 3) {   // Lowered to 3 for easy testing
    return NextResponse.json({ 
      error: "daily_limit_reached",
      message: "You've reached your daily limit of 3 messages. Upgrade to Premium for unlimited access to SerenitySpark!" 
    }, { status: 429 })
  }

  // Increment count
  await supabase
    .from('chat_usage')
    .upsert({ 
      user_id: user.id, 
      date: today, 
      message_count: count + 1 
    })

  return NextResponse.json({
    role: "assistant",
    content: `Hello! You have used ${count + 1}/3 messages today. How can I support you?`
  })
}