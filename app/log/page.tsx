"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MoodSelector } from "@/components/mood-selector"
import { IntensitySlider } from "@/components/intensity-slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { logMood } from "./actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LogPage() {
  const [emotion, setEmotion] = useState("")
  const [customEmotion, setCustomEmotion] = useState("")
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!emotion) {
      setError("Please select an emotion")
      setIsLoading(false)
      return
    }

    if (emotion === "custom" && !customEmotion.trim()) {
      setError("Please enter a custom emotion")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("emotion", emotion === "custom" ? customEmotion : emotion)
    formData.append("intensity", intensity.toString())
    formData.append("note", note)

    const result = await logMood(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neon-lime mb-2">Log Your Mood</h1>
          <p className="text-cyber-text">Track how you're feeling right now</p>
        </div>

        <Card className="border-neon-lime/20 bg-cyber-dark/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">How are you feeling?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emotion Selection */}
              <div>
                <Label className="text-cyber-text mb-3 block">Select your emotion</Label>
                <MoodSelector
                  selected={emotion}
                  onSelect={setEmotion}
                  customEmotion={customEmotion}
                  onCustomEmotionChange={setCustomEmotion}
                />
              </div>

              {/* Intensity Slider */}
              <div>
                <IntensitySlider value={intensity} onChange={setIntensity} />
              </div>

              {/* Optional Note */}
              <div>
                <Label htmlFor="note" className="text-cyber-text mb-2 block">
                  Add a note (optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="What's on your mind?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-neon-lime/30 bg-cyber-darker text-white placeholder:text-cyber-text/50 focus:border-neon-lime min-h-[100px]"
                />
              </div>

              {error && <p className="text-sm text-neon-coral">{error}</p>}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-neon-lime hover:bg-neon-lime/90 font-semibold shadow-neon-lime text-foreground border-background bg-accent"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Mood"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
