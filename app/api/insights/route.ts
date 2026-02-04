import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { moods } = await req.json()

  const moodSummary = moods
    .map((m: { emotion: string; intensity: number; created_at: string }) => {
      return `${m.emotion} (${m.intensity}/10) on ${new Date(m.created_at).toLocaleDateString()}`
    })
    .join(", ")

  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Analyze these recent mood entries and provide a brief, supportive insight (2-3 sentences) about emotional patterns, trends, or suggestions for wellness:

${moodSummary}

Focus on being encouraging and actionable. Highlight positive patterns or suggest gentle improvements.`,
  })

  return Response.json({ insight: text })
}
