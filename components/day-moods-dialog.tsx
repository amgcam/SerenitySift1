"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { MoodCard } from "./mood-card"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

interface DayMoodsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  moods: Mood[]
}

export function DayMoodsDialog({ open, onOpenChange, date, moods }: DayMoodsDialogProps) {
  if (!date) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neon-lime/20 bg-cyber-dark/95 backdrop-blur-xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-neon-lime">{format(date, "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {moods.length > 0 ? (
            moods.map((mood) => <MoodCard key={mood.id} {...mood} />)
          ) : (
            <p className="text-center text-cyber-text py-8">No moods logged on this day</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
