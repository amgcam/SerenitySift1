import { createClient } from "@/lib/supabase/server"
import { streamText, convertToModelMessages, type UIMessage } from "ai"

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { messages }: { messages: UIMessage[] } = await req.json()

  let moodContext = "No mood history available yet."

  if (user) {
    // Fetch recent moods for context if user is authenticated
    const { data: recentMoods } = await supabase
      .from("moods")
      .select("emotion, intensity, note, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (recentMoods && recentMoods.length > 0) {
      moodContext = `Recent mood history: ${recentMoods.map((m) => `${m.emotion} (intensity: ${m.intensity}/10) - ${m.note || "no note"}`).join(", ")}`
    }
  } else {
    moodContext = "Preview mode: Sign up to track your moods and get personalized insights!"
  }

  const systemPrompt = `You are SerenitySpark, a compassionate AI wellness companion for the SerenitySift app. Your role is to:

- Provide emotional support and validation
- Help users understand their feelings
- Suggest healthy coping strategies
- Encourage mindfulness and self-care
- Be warm, empathetic, and non-judgmental
- Keep responses concise and actionable (2-4 sentences)
- Never provide medical advice or diagnose conditions
- Encourage professional help when appropriate

${moodContext}

Respond in a supportive, friendly tone while being mindful of the user's emotional state based on their mood history.`

  try {
    const result = streamText({
      model: "openai/gpt-4o",
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    })

    if (user) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "user") {
        const userText = lastMessage.parts
          .filter((part) => part.type === "text")
          .map((part) => (part as any).text)
          .join(" ")

        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "user",
          content: userText,
        })
      }
    }

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[v0] AI Gateway error:", error)

    // Check if it's a credit card verification error
    if (error?.message?.includes("customer_verification_required") || error?.message?.includes("credit card")) {
      return new Response(
        JSON.stringify({
          error: {
            message:
              "AI chat is currently unavailable in preview mode. The AI Gateway requires a credit card to be configured. To enable AI chat, please add a credit card at vercel.com/ai or deploy this app to your own Vercel account.",
            type: "configuration_required",
          },
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Generic error fallback
    return new Response(
      JSON.stringify({
        error: {
          message:
            "I'm having trouble connecting right now. Please try again in a moment. If the issue persists, check your AI Gateway configuration.",
          type: "service_unavailable",
        },
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
