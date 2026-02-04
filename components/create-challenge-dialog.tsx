"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Loader2 } from "lucide-react"
import { createChallenge } from "@/app/challenges/actions"

export function CreateChallengeDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [frequency, setFrequency] = useState("daily")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("frequency", frequency)

    const result = await createChallenge(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setOpen(false)
      setIsLoading(false)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-neon-lime text-black hover:bg-neon-lime/90 shadow-neon-lime">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="border-neon-lime/20 bg-cyber-dark/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-neon-lime">Create New Challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title" className="text-cyber-text">
              Challenge Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Morning meditation"
              required
              className="border-neon-lime/30 bg-cyber-darker text-white placeholder:text-cyber-text/50 focus:border-neon-lime mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-cyber-text">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What does this challenge involve?"
              className="border-neon-lime/30 bg-cyber-darker text-white placeholder:text-cyber-text/50 focus:border-neon-lime mt-2"
            />
          </div>

          <div>
            <Label htmlFor="frequency" className="text-cyber-text">
              Frequency
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="border-neon-lime/30 bg-cyber-darker text-white focus:border-neon-lime mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-neon-lime/20 bg-cyber-dark text-white">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-neon-coral">{error}</p>}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-neon-lime text-black hover:bg-neon-lime/90 shadow-neon-lime"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Challenge"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
