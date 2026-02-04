"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Sparkles, Send, Check, Crown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Recommendation {
  title: string
  reason: string
  actionItems: string[]
  confidence: number
}

export default function AIConcierge() {
  const [query, setQuery] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsThinking(true)
    setRecommendation(null)

    // Simulate AI thinking
    setTimeout(() => {
      setRecommendation({
        title: "Morning Workout at Central Gym",
        reason:
          "Based on your mood history showing peak energy at 7am and preference for structured activities, I recommend a 45-minute gym session.",
        actionItems: [
          "Set alarm for 6:15am to prepare",
          "Pack gym bag tonight with workout clothes",
          "Schedule the 7am strength training class",
          "Prepare post-workout protein shake ingredients",
        ],
        confidence: 94,
      })
      setIsThinking(false)
    }, 3000)
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-soft-cyan" />
            <h1 className="text-4xl font-bold text-white">AI Concierge</h1>
          </div>
          <p className="text-soft-text text-lg">Let me decide for you. Stop thinking. Start doing.</p>

          {!isPremium && (
            <Badge className="bg-gradient-to-r from-warm-orange to-soft-coral text-white">
              <Crown className="w-3 h-3 mr-1" />
              Premium Feature
            </Badge>
          )}
        </div>

        {/* Input Form */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="decision" className="text-sm text-soft-text mb-2 block">
                  What do you need me to decide?
                </label>
                <Input
                  id="decision"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What should I do for exercise tomorrow morning?"
                  className="bg-white/5 border-white/10 text-white placeholder:text-soft-text text-lg p-6"
                  disabled={!isPremium}
                />
              </div>
              <Button
                type="submit"
                disabled={!isPremium || !query.trim() || isThinking}
                className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold py-6 text-lg rounded-full shadow-soft-glow"
              >
                {isThinking ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get My Answer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Thinking Animation */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-soft-cyan rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-soft-text">Analyzing your preferences and mood patterns...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendation */}
        <AnimatePresence>
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-gradient-to-br from-soft-cyan/10 to-soft-blue/10 backdrop-blur-xl border-soft-cyan/30">
                <CardContent className="p-6 space-y-6">
                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className="bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30">
                      {recommendation.confidence}% confident
                    </Badge>
                    <Sparkles className="w-5 h-5 text-soft-cyan" />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{recommendation.title}</h2>
                    <p className="text-soft-text leading-relaxed">{recommendation.reason}</p>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Your action plan:</h3>
                    <div className="space-y-2">
                      {recommendation.actionItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-soft-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-soft-cyan text-sm font-medium">{index + 1}</span>
                          </div>
                          <p className="text-white">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold rounded-full">
                    <Check className="w-5 h-5 mr-2" />
                    I'll Do This
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade CTA */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-warm-orange/10 to-soft-coral/10 backdrop-blur-xl border-warm-orange/30">
            <CardContent className="p-6 text-center space-y-4">
              <Crown className="w-12 h-12 text-warm-orange mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Upgrade to Serenity Concierge</h3>
                <p className="text-soft-text">
                  Stop deciding. Start doing. Let AI handle your daily choices while you focus on what matters.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-left bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-soft-cyan" />
                  <span>Unlimited AI decisions per day</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-soft-cyan" />
                  <span>Personalized action plans</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-soft-cyan" />
                  <span>Smart context from your mood history</span>
                </div>
              </div>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-warm-orange to-soft-coral text-white hover:opacity-90 font-semibold rounded-full shadow-warm-glow"
              >
                <Link href="/subscription">Upgrade Now - $4.99/month</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
