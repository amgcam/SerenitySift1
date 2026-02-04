import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface MoodCardProps {
  emotion: string
  intensity: number
  note?: string
  createdAt?: string
  created_at?: string // Support both camelCase and snake_case for compatibility
}

const emotionColors: Record<string, string> = {
  happy: "text-neon-lime border-neon-lime/30",
  sad: "text-electric-blue border-electric-blue/30",
  anxious: "text-neon-coral border-neon-coral/30",
  calm: "text-neon-lime border-neon-lime/30",
  angry: "text-neon-coral border-neon-coral/30",
  excited: "text-neon-lime border-neon-lime/30",
}

export function MoodCard({ emotion, intensity, note, createdAt, created_at }: MoodCardProps) {
  const colorClass = emotionColors[emotion.toLowerCase()] || "text-cyber-text border-cyber-text/30"

  const dateString = createdAt || created_at
  let formattedDate = "Just now"

  if (dateString) {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        formattedDate = formatDistanceToNow(date, { addSuffix: true })
      }
    } catch (error) {
      console.error("[v0] Invalid date format:", dateString)
    }
  }

  return (
    <Card className={`border bg-cyber-dark/50 backdrop-blur ${colorClass}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg capitalize">{emotion}</h3>
            <p className="text-sm text-cyber-text">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-1 h-6 rounded-full ${i < intensity ? "bg-current" : "bg-cyber-text/20"}`} />
            ))}
          </div>
        </div>
        {note && <p className="text-sm text-cyber-text mt-2">{note}</p>}
      </CardContent>
    </Card>
  )
}
