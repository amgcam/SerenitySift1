"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { Crown, Palette, LogOut, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { THEMES, type ThemeId } from "@/lib/products"
import { updateTheme } from "@/app/actions/theme"
import { useRouter } from "next/navigation"
import Checkout from "@/components/checkout"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NotificationSettings } from "@/components/notification-settings"

interface Profile {
  subscription_status: "free" | "premium"
  purchased_themes: string[]
  active_theme: string
  display_name: string
}

export function SettingsClient({ user, profile }: { user: User; profile: Profile | null }) {
  const router = useRouter()
  const [activeTheme, setActiveTheme] = useState<ThemeId>((profile?.active_theme as ThemeId) || "default")
  const [showSubscriptionCheckout, setShowSubscriptionCheckout] = useState(false)
  const [showThemesCheckout, setShowThemesCheckout] = useState(false)
  const isPremium = profile?.subscription_status === "premium"
  const hasThemesPack = (profile?.purchased_themes?.length || 0) > 1

  const handleThemeChange = async (themeId: ThemeId) => {
    setActiveTheme(themeId)
    await updateTheme(user.id, themeId)
    router.refresh()
  }

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple via-deep-blue to-deep-teal p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-soft-text/70">Manage your account and preferences</p>
        </div>

        {/* Account Info */}
        <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-soft-cyan">Account</CardTitle>
            <CardDescription className="text-soft-text/70">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-soft-text">Display Name</p>
                <p className="text-sm text-soft-text/70">{profile?.display_name || "User"}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-coral/30 text-coral hover:bg-coral/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Subscription */}
        <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-soft-cyan flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription
              </CardTitle>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-soft-orange to-soft-coral text-white">Premium</Badge>
              )}
            </div>
            <CardDescription className="text-soft-text/70">
              {isPremium ? "You have access to all premium features" : "Upgrade to unlock premium features"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isPremium && (
              <div className="space-y-3">
                <div className="text-sm text-soft-text/80 space-y-2">
                  <p className="font-medium">Premium includes:</p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-soft-cyan" />
                      In-depth AI feedback and insights
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-soft-cyan" />
                      Unlimited custom emotions
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-soft-cyan" />
                      Exportable data
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-soft-cyan" />
                      Ad-free experience
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={() => setShowSubscriptionCheckout(true)}
                  className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue hover:opacity-90"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium - $4.99/month
                </Button>
              </div>
            )}
            {isPremium && <p className="text-sm text-soft-text/70">Thank you for supporting SerenitySift!</p>}
          </CardContent>
        </Card>

        {/* Themes */}
        <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-soft-cyan flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Themes
              </CardTitle>
              {hasThemesPack && (
                <Badge className="bg-gradient-to-r from-soft-purple to-soft-blue text-white">Unlocked</Badge>
              )}
            </div>
            <CardDescription className="text-soft-text/70">Customize your app appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const isLocked = !theme.free && !profile?.purchased_themes.includes(theme.id)
                const isActive = activeTheme === theme.id

                return (
                  <button
                    key={theme.id}
                    onClick={() => !isLocked && handleThemeChange(theme.id)}
                    disabled={isLocked}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all
                      ${isActive ? "border-soft-cyan bg-soft-cyan/10" : "border-soft-text/20 bg-deep-purple/50"}
                      ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:border-soft-cyan/50 cursor-pointer"}
                    `}
                  >
                    <div className="text-sm font-medium text-soft-text">{theme.name}</div>
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-soft-text/50" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {!hasThemesPack && (
              <Button
                onClick={() => setShowThemesCheckout(true)}
                variant="outline"
                className="w-full border-soft-purple/30 text-soft-purple hover:bg-soft-purple/10"
              >
                <Palette className="w-4 h-4 mr-2" />
                Unlock All Themes - $1.99
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Checkout Dialog */}
      <Dialog open={showSubscriptionCheckout} onOpenChange={setShowSubscriptionCheckout}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-deep-purple border-soft-cyan/20">
          <DialogHeader>
            <DialogTitle className="text-soft-cyan">Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <Checkout productId="premium-subscription" />
        </DialogContent>
      </Dialog>

      {/* Themes Checkout Dialog */}
      <Dialog open={showThemesCheckout} onOpenChange={setShowThemesCheckout}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-deep-purple border-soft-cyan/20">
          <DialogHeader>
            <DialogTitle className="text-soft-cyan">Unlock All Themes</DialogTitle>
          </DialogHeader>
          <Checkout productId="themes-pack" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
