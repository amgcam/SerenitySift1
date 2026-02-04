"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, Zap, TrendingUp, FileText, Bell, Code, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PRO_TIERS, type ProTier } from "@/lib/pro-tiers"
import { createCheckoutSession } from "@/app/actions/stripe"

interface ProUpgradeClientProps {
  currentTier: ProTier
}

export function ProUpgradeClient({ currentTier }: ProUpgradeClientProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null)

  const handleUpgrade = async (tier: ProTier) => {
    setIsUpgrading(tier)
    try {
      // Map tier to product ID (these would be your actual Stripe product IDs)
      const productIds: Record<string, string> = {
        "pro-monthly": "price_pro_monthly",
        "pro-annual": "price_pro_annual",
        "scope-monthly": "price_scope_monthly",
        "scope-annual": "price_scope_annual",
      }

      const productId = productIds[`${tier}-${billingCycle}`]
      const result = await createCheckoutSession(productId)

      if (result.error) {
        alert(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error("[v0] Upgrade error:", error)
      alert("Failed to start upgrade process. Please try again.")
    } finally {
      setIsUpgrading(null)
    }
  }

  const getPrice = (tier: ProTier) => {
    const config = PRO_TIERS[tier]
    if (tier === "free") return "$0"
    if (billingCycle === "annual") {
      return `$${config.annualPrice}/yr`
    }
    return `$${config.price}/mo`
  }

  const getSavings = (tier: ProTier) => {
    const config = PRO_TIERS[tier]
    if (tier === "free" || !config.annualPrice) return null
    const monthlyCost = config.price * 12
    const savings = monthlyCost - config.annualPrice
    return savings
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">Choose Your Plan</h1>
          <p className="text-xl text-soft-text max-w-2xl mx-auto">
            Unlock powerful tools to support your patients' wellness journey
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "text-white" : "text-soft-text"}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
            />
            <Label htmlFor="billing-toggle" className={billingCycle === "annual" ? "text-white" : "text-soft-text"}>
              Annual
            </Label>
            {billingCycle === "annual" && <Badge className="bg-coral/20 text-coral border-coral/30">Save 17%</Badge>}
          </div>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card
              className={`border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl ${
                currentTier === "free" ? "ring-2 ring-soft-cyan" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white">Free</CardTitle>
                <CardDescription className="text-soft-text">Get started with basic features</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {PRO_TIERS.free.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-soft-text">
                      <Check className="w-5 h-5 text-soft-cyan shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {currentTier === "free" ? (
                  <Badge className="w-full justify-center bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30">
                    Current Plan
                  </Badge>
                ) : (
                  <Button disabled className="w-full bg-transparent" variant="outline">
                    Downgrade
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card
              className={`border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl ${
                currentTier === "pro" ? "ring-2 ring-soft-cyan" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-soft-cyan" />
                  <CardTitle className="text-2xl text-white">Serenity Pro</CardTitle>
                </div>
                <CardDescription className="text-soft-text">For growing practices</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-white">{getPrice("pro")}</span>
                  {billingCycle === "annual" && getSavings("pro") && (
                    <p className="text-sm text-soft-cyan mt-1">Save ${getSavings("pro")}/year</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {PRO_TIERS.pro.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-soft-text">
                      <Check className="w-5 h-5 text-soft-cyan shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {currentTier === "pro" ? (
                  <Badge className="w-full justify-center bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30">
                    Current Plan
                  </Badge>
                ) : (
                  <Button
                    onClick={() => handleUpgrade("pro")}
                    disabled={isUpgrading !== null}
                    className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow"
                  >
                    {isUpgrading === "pro" ? "Processing..." : "Upgrade to Pro"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Scope Tier */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card
              className={`border-coral/20 bg-deep-purple/80 backdrop-blur-xl relative ${
                currentTier === "scope" ? "ring-2 ring-coral" : ""
              }`}
            >
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral to-soft-purple text-white border-0">
                Most Popular
              </Badge>
              <CardHeader className="pt-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-coral" />
                  <CardTitle className="text-2xl text-white">Serenity Scope</CardTitle>
                </div>
                <CardDescription className="text-soft-text">For established practices</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-white">{getPrice("scope")}</span>
                  {billingCycle === "annual" && getSavings("scope") && (
                    <p className="text-sm text-coral mt-1">Save ${getSavings("scope")}/year</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {PRO_TIERS.scope.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-soft-text">
                      <Check className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {currentTier === "scope" ? (
                  <Badge className="w-full justify-center bg-coral/20 text-coral border-coral/30">Current Plan</Badge>
                ) : (
                  <Button
                    onClick={() => handleUpgrade("scope")}
                    disabled={isUpgrading !== null}
                    className="w-full bg-gradient-to-r from-coral to-soft-purple text-white hover:opacity-90 shadow-soft-glow"
                  >
                    {isUpgrading === "scope" ? "Processing..." : "Upgrade to Scope"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Feature Comparison</CardTitle>
              <CardDescription className="text-soft-text">See what's included in each plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-soft-cyan">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-semibold">Mood Analytics</h3>
                  </div>
                  <p className="text-sm text-soft-text">Track emotional patterns and trends over time</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-soft-cyan">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-semibold">Data Exports</h3>
                  </div>
                  <p className="text-sm text-soft-text">Download patient reports in PDF format</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-soft-cyan">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-semibold">Smart Alerts</h3>
                  </div>
                  <p className="text-sm text-soft-text">Get notified of concerning mood patterns</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-coral">
                    <Code className="w-5 h-5" />
                    <h3 className="font-semibold">API Access</h3>
                  </div>
                  <p className="text-sm text-soft-text">Integrate with your existing systems (Scope only)</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-coral">
                    <Shield className="w-5 h-5" />
                    <h3 className="font-semibold">Audit Logs</h3>
                  </div>
                  <p className="text-sm text-soft-text">Complete compliance tracking (Scope only)</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-coral">
                    <Zap className="w-5 h-5" />
                    <h3 className="font-semibold">Priority Support</h3>
                  </div>
                  <p className="text-sm text-soft-text">Get help when you need it (Scope only)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* HIPAA Notice */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-soft-purple/20 bg-soft-purple/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-soft-purple shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliance Ready</h3>
                  <p className="text-soft-text">
                    Pro and Scope tiers are designed with compliance in mind. Contact our support team to sign a
                    Business Associate Agreement (BAA) and ensure your practice meets all regulatory requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
