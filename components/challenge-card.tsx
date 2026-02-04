"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import { toggleChallengeCompletion, deleteChallenge } from "@/app/challenges/actions"
import { useState } from "react"
import { format } from "date-fns"

interface ChallengeCardProps {
  id: string
  title: string
  description: string | null
  frequency: string
  completedDates: string[]
}

export function ChallengeCard({ id, title, description, frequency, completedDates }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const today = format(new Date(), "yyyy-MM-dd")
  const isCompletedToday = completedDates.includes(today)

  const handleToggle = async () => {
    setIsLoading(true)
    await toggleChallengeCompletion(id, today)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this challenge?")) {
      setIsLoading(true)
      await deleteChallenge(id)
      setIsLoading(false)
    }
  }

  const streak = calculateStreak(completedDates)

  return (
    <Card className="border-neon-lime/20 bg-cyber-dark/50 backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          {description && <p className="text-sm text-cyber-text mt-1">{description}</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isLoading}
          className="text-neon-coral hover:text-neon-coral/80 hover:bg-neon-coral/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-cyber-text capitalize">{frequency}</p>
            <p className="text-sm font-semibold text-neon-lime">{streak} day streak</p>
            <p className="text-xs text-cyber-text">{completedDates.length} total completions</p>
          </div>
          <Button
            onClick={handleToggle}
            disabled={isLoading}
            className={
              isCompletedToday
                ? "bg-neon-lime text-black hover:bg-neon-lime/90 shadow-neon-lime"
                : "bg-cyber-darker border border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10"
            }
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Mark Done
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const sortedDates = [...completedDates].sort().reverse()
  let streak = 0
  const currentDate = new Date()

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr)
    const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}
