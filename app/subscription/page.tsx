"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, TrendingUp, Heart, FileText, Check, Crown, Star, ChevronDown, ChevronUp, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { createCheckoutSession } from "@/app/actions/stripe"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null)
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      if (!supabase) {
        setCheckingAuth(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsEmailConfirmed(!!user?.email_confirmed_at)
      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleSubscribe = async (productId: string) => {
    if (!isEmailConfirmed) {
      alert("Please confirm your email address before subscribing. Check your inbox for the confirmation link.")
      return
    }

    setLoading(productId)
    try {
      const result = await createCheckoutSession(productId)

      if (result.error) {
        console.error("[v0] Checkout error:", result.error)
        alert(result.error)
      } else if (result.url) {
        console.log("[v0] Redirecting to:", result.url)
        router.push(result.url)
      }
    } catch (error) {
      console.error("[v0] Checkout exception:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const togglePreview = (itemId: string) => {
    setExpandedPreview(expandedPreview === itemId ? null : itemId)
  }

  const freeTierFeatures = [
    { icon: Check, text: "Daily mood logging" },
    { icon: Check, text: "Basic calendar view" },
    { icon: Check, text: "Recent moods list" },
    { icon: Check, text: "7-day streak tracking" },
  ]

  const premiumFeatures = [
    { icon: Star, text: "In-depth AI feedback & insights", color: "text-[#00D4FF]" },
    { icon: TrendingUp, text: "Weekly & monthly emotion trends", color: "text-[#00D4FF]" },
    {
      icon: Palette,
      text: "Unlock all premade themes (Cyberpunk, Light Mode, Nature) plus unlimited custom themes creation",
      color: "text-[#00D4FF]",
    },
    { icon: ArrowUp, text: "Work Stress Analyzer – Track work-related stress patterns", color: "text-[#00D4FF]" },
    {
      icon: Heart,
      text: "Relationship Mood Tracker – Monitor relationship emotional patterns",
      color: "text-[#00D4FF]",
    },
    { icon: FileText, text: "Unlimited exportable data (PDF/CSV) with no credit limits", color: "text-[#00D4FF]" },
    { icon: Heart, text: "Predictive mood insights", color: "text-[#00D4FF]" },
  ]

  const themes = [
    {
      name: "Cyberpunk",
      description:
        "Bold, futuristic vibe with vibrant lime green backgrounds, coral accents, and neon glow effects—perfect for tech enthusiasts.",
      colors: ["#00E676", "#FF7F7F", "#00C4FF"],
    },
    {
      name: "Light Mode",
      description:
        "Clean, bright white base with pastel cyan highlights for a fresh, daytime feel—ideal for reducing eye strain.",
      colors: ["#F5F5F5", "#00BCD4", "#E0E0E0"],
    },
    {
      name: "Nature",
      description:
        "Calming forest green with earthy tones and subtle wave patterns—great for a relaxed, organic experience.",
      colors: ["#228B22", "#8FBC8F", "#F5F5DC"],
    },
  ]

  if (checkingAuth) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-soft-text">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (user && !isEmailConfirmed) {
    return (
      <DashboardLayout>
        <motion.div className="space-y-8 pb-24 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-soft-coral/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-soft-coral">Email Confirmation Required</CardTitle>
              <CardDescription className="text-soft-text">
                Please confirm your email address before subscribing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-soft-text">
                We've sent a confirmation email to <strong className="text-white">{user.email}</strong>. Please check
                your inbox and click the confirmation link to access subscription features.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div className="space-y-8 pb-24" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center">
          <h1 className="text-4xl font-medium text-[#00D4FF] mb-2">Unlock Premium Features</h1>
          <p className="text-[#94A3B8]">Choose the plan that works best for you</p>
        </motion.div>

        {/* Freemium Tiers */}
        <motion.div variants={cardVariants} className="grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl text-[#00D4FF] font-medium">Free Tier</h3>
              <Badge variant="outline" className="border-[#00D4FF] text-[#00D4FF]">
                Currently Free
              </Badge>
            </div>
            <p className="text-[#94A3B8] mb-6">Essential mood tracking features</p>

            <div className="space-y-4">
              {freeTierFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-[#00D4FF]" />
                  <span className="text-[#A5B4FC]">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Tier */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,212,255,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/20 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl text-[#00D4FF] font-medium flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Premium
              </h3>
              <Badge className="bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white rounded-full px-3 py-1">
                Most Popular
              </Badge>
            </div>
            <p className="text-[#94A3B8] mb-6">
              Advanced AI insights, unlimited features, and all one-time purchases included
            </p>

            <div className="space-y-4 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5 text-[#00D4FF]")} />
                  <span className="text-[#A5B4FC] text-sm leading-relaxed">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-medium text-[#00D4FF]">
                ${billingPeriod === "monthly" ? "4.99" : "34.99"}
              </div>
              <div className="text-sm text-[#94A3B8]">per {billingPeriod === "monthly" ? "month" : "year"}</div>
            </div>

            <Button
              onClick={() => handleSubscribe(billingPeriod === "monthly" ? "premium-monthly" : "premium-yearly")}
              disabled={loading !== null}
              className="w-full h-12 bg-gradient-to-r from-[#00D4FF] to-[#0891B2] hover:opacity-90 text-white font-medium rounded-full shadow-[0_0_20px_rgba(0,212,255,0.6)]"
            >
              {loading === `premium-${billingPeriod}` ? "Processing..." : "Subscribe Now"}
            </Button>
          </div>
        </motion.div>

        {/* In-App Purchases */}
        <motion.div variants={cardVariants} className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00D4FF]">In-App Purchases</h2>
          <p className="text-[#94A3B8] text-sm">
            Or purchase individual features separately (included free with Premium subscription)
          </p>

          {/* Themes Pack */}
          <Card className="border-[#00D4FF]/20 bg-white/5 backdrop-blur-xl rounded-[20px]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-[#00D4FF]" />
                <div className="flex-1">
                  <CardTitle className="text-xl text-[#00D4FF] font-medium">Themes Pack</CardTitle>
                  <CardDescription className="text-[#94A3B8]">
                    Unlock Cyberpunk, Light Mode, and Nature themes
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-[#00D4FF]">$1.99</div>
                  <div className="text-xs text-[#94A3B8]">one-time</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => togglePreview("themes-pack")}
                variant="ghost"
                className="w-full justify-between text-[#00D4FF] hover:bg-[#00D4FF]/10"
              >
                <span>Preview Themes</span>
                {expandedPreview === "themes-pack" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              <AnimatePresence>
                {expandedPreview === "themes-pack" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {themes.map((theme, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-64 p-4 bg-[#1A252F] rounded-xl border border-[#00D4FF]/20"
                          >
                            <h4 className="text-white font-semibold mb-2">{theme.name}</h4>
                            <p className="text-[#A0A0A0] text-xs sm:text-sm mb-3 leading-relaxed">
                              {theme.description}
                            </p>
                            <div className="flex gap-2">
                              {theme.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-8 h-8 rounded-lg border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={() => handleSubscribe("themes-pack")}
                disabled={loading !== null}
                variant="outline"
                className="w-full border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
              >
                {loading === "themes-pack" ? "Processing..." : "Buy Themes"}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Insights Packs */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Work Stress Analyzer */}
            <Card className="border-[#00D4FF]/20 bg-white/5 backdrop-blur-xl rounded-[20px]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#00D4FF]" />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#00D4FF] font-medium">Work Stress Analyzer</CardTitle>
                    <CardDescription className="text-[#94A3B8] text-sm">
                      Track work-related stress patterns
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-medium text-[#00D4FF]">$2.99</div>

                <Button
                  onClick={() => togglePreview("work-stress")}
                  variant="ghost"
                  className="w-full justify-between text-[#00D4FF] hover:bg-[#00D4FF]/10"
                >
                  <span>Preview</span>
                  {expandedPreview === "work-stress" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                <AnimatePresence>
                  {expandedPreview === "work-stress" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-[#1A252F] rounded-xl border border-[#00D4FF]/20 space-y-3">
                        <h4 className="text-white font-semibold text-sm">AI-Powered Insights</h4>
                        <p className="text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
                          Track work-related stress patterns with AI-powered charts. See how meetings spike your anxiety
                          by 15% and get recommendations like "Take a 5-minute break every hour."
                        </p>
                        <div className="bg-[#00D4FF]/10 p-3 rounded-lg">
                          <div className="text-xs text-[#00D4FF] font-mono">
                            📊 Meeting Impact: +15% anxiety
                            <br />💡 Recommendation: 5-min breaks
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={() => handleSubscribe("work-stress-analyzer")}
                  disabled={loading !== null}
                  variant="outline"
                  className="w-full border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
                >
                  {loading === "work-stress-analyzer" ? "Processing..." : "Buy Now"}
                </Button>
              </CardContent>
            </Card>

            {/* Relationship Mood Tracker */}
            <Card className="border-[#00D4FF]/20 bg-white/5 backdrop-blur-xl rounded-[20px]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-[#00D4FF]" />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#00D4FF] font-medium">Relationship Mood Tracker</CardTitle>
                    <CardDescription className="text-[#94A3B8] text-sm">
                      Monitor relationship emotional patterns
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-medium text-[#00D4FF]">$2.99</div>

                <Button
                  onClick={() => togglePreview("relationship")}
                  variant="ghost"
                  className="w-full justify-between text-[#00D4FF] hover:bg-[#00D4FF]/10"
                >
                  <span>Preview</span>
                  {expandedPreview === "relationship" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                <AnimatePresence>
                  {expandedPreview === "relationship" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-[#1A252F] rounded-xl border border-[#00D4FF]/20 space-y-3">
                        <h4 className="text-white font-semibold text-sm">Partner Mood Tracking</h4>
                        <p className="text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
                          Monitor emotional patterns with your partner. See how shared activities boost your mood
                          average by 20%, with graphs showing joint trends and tips like "Plan weekly check-ins."
                        </p>
                        <div className="bg-[#00D4FF]/10 p-3 rounded-lg">
                          <div className="text-xs text-[#00D4FF] font-mono">
                            💕 Shared Activities: +20% mood
                            <br />💡 Tip: Weekly check-ins
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={() => handleSubscribe("relationship-tracker")}
                  disabled={loading !== null}
                  variant="outline"
                  className="w-full border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
                >
                  {loading === "relationship-tracker" ? "Processing..." : "Buy Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Export Credits */}
          <Card className="border-[#00D4FF]/20 bg-white/5 backdrop-blur-xl rounded-[20px]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#00D4FF]" />
                <div className="flex-1">
                  <CardTitle className="text-xl text-[#00D4FF] font-medium">Export Credits</CardTitle>
                  <CardDescription className="text-[#94A3B8]">Purchase 5 PDF/CSV export credits</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-[#00D4FF]">$1.99</div>
                  <div className="text-xs text-[#94A3B8]">5 exports</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => togglePreview("export-credits")}
                variant="ghost"
                className="w-full justify-between text-[#00D4FF] hover:bg-[#00D4FF]/10"
              >
                <span>Preview</span>
                {expandedPreview === "export-credits" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              <AnimatePresence>
                {expandedPreview === "export-credits" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {themes.map((theme, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-64 p-4 bg-[#1A252F] rounded-xl border border-[#00D4FF]/20"
                          >
                            <h4 className="text-white font-semibold mb-2">{theme.name}</h4>
                            <p className="text-[#A0A0A0] text-xs sm:text-sm mb-3 leading-relaxed">
                              {theme.description}
                            </p>
                            <div className="flex gap-2">
                              {theme.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-8 h-8 rounded-lg border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={() => handleSubscribe("export-credits")}
                disabled={loading !== null}
                variant="outline"
                className="w-full border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
              >
                {loading === "export-credits" ? "Processing..." : "Purchase Exports"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
