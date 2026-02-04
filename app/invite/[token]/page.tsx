"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import { Shield, Check, X, Heart, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [shareMoods, setShareMoods] = useState(true)
  const [shareNotes, setShareNotes] = useState(true)
  const [shareChats, setShareChats] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  // Mock professional data - in real app, fetch from API
  const professionalName = "Dr. Sarah Johnson"
  const professionalRole = "Licensed Therapist"

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const response = await fetch("/api/pro/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, shareMoods, shareNotes, shareChats }),
      })

      if (!response.ok) throw new Error("Failed to accept invite")

      // Show confetti animation
      // Redirect to app with success message
      window.location.href = "/dashboard?connected=true"
    } catch (error) {
      console.error("[v0] Accept invite error:", error)
      alert("Failed to accept invitation. Please try again.")
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    try {
      await fetch("/api/pro/decline-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      window.location.href = "/dashboard"
    } catch (error) {
      console.error("[v0] Decline invite error:", error)
    } finally {
      setIsDeclining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <Card className="border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/logo.png" alt="SerenitySift Logo" width={80} height={80} className="rounded-2xl" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Connection Request</CardTitle>
            <CardDescription className="text-soft-text text-lg">
              <span className="text-white font-medium">{professionalName}</span> ({professionalRole}) has invited you to
              share your Serenity Sift data
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* What's Shared Section */}
            <div className="bg-soft-cyan/5 border border-soft-cyan/20 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-medium mb-4">
                <Shield className="w-5 h-5 text-soft-cyan" />
                <span>What will be shared?</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-coral" />
                    <div>
                      <Label htmlFor="share-moods" className="text-white cursor-pointer">
                        Mood Logs
                      </Label>
                      <p className="text-xs text-soft-text">Your emotions, intensity, and notes</p>
                    </div>
                  </div>
                  <Switch id="share-moods" checked={shareMoods} onCheckedChange={setShareMoods} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-soft-blue" />
                    <div>
                      <Label htmlFor="share-notes" className="text-white cursor-pointer">
                        Journal Notes
                      </Label>
                      <p className="text-xs text-soft-text">Your written reflections</p>
                    </div>
                  </div>
                  <Switch id="share-notes" checked={shareNotes} onCheckedChange={setShareNotes} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-soft-purple" />
                    <div>
                      <Label htmlFor="share-chats" className="text-white cursor-pointer">
                        AI Conversations
                      </Label>
                      <p className="text-xs text-soft-text">Your chats with Serenity Spark</p>
                    </div>
                  </div>
                  <Switch id="share-chats" checked={shareChats} onCheckedChange={setShareChats} />
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-soft-purple/10 border border-soft-purple/20 rounded-lg p-4">
              <p className="text-sm text-soft-text">
                <Shield className="w-4 h-4 inline mr-1 text-soft-purple" />
                You control your data. You can revoke access anytime from your settings. Your professional can only view
                data you choose to share.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDecline}
                disabled={isDeclining || isAccepting}
                variant="outline"
                className="flex-1 border-soft-text/20 text-soft-text hover:bg-soft-text/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                disabled={isAccepting || isDeclining}
                className="flex-1 bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow"
              >
                <Check className="w-4 h-4 mr-2" />
                {isAccepting ? "Accepting..." : "Accept & Connect"}
              </Button>
            </div>

            <p className="text-xs text-center text-soft-text">This invitation expires in 7 days</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
