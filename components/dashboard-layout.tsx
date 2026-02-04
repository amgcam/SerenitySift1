"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Navigation, DesktopNavigation } from "./navigation"
import { OnboardingDemo } from "./onboarding-demo"
import { PremiumDemo } from "./premium-demo"

export function DashboardLayout({ children, isPremium }: { children: React.ReactNode; isPremium?: boolean }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPremiumDemo, setShowPremiumDemo] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("firstTimeDemoShown")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    if (isPremium !== undefined) {
      localStorage.setItem("userPremiumStatus", String(isPremium))
    }

    const checkPremiumDemo = () => {
      const hasSeenPremiumDemo = localStorage.getItem("premiumDemoShown")
      const storedPremiumStatus = localStorage.getItem("userPremiumStatus") === "true"

      if (storedPremiumStatus && !hasSeenPremiumDemo) {
        setShowPremiumDemo(true)
      }
    }

    checkPremiumDemo()
    // Check again after a short delay in case premium status was just updated
    const timer = setTimeout(checkPremiumDemo, 1000)

    return () => clearTimeout(timer)
  }, [isPremium])

  const handleOnboardingComplete = () => {
    localStorage.setItem("firstTimeDemoShown", "true")
    setShowOnboarding(false)
  }

  const handlePremiumDemoComplete = () => {
    localStorage.setItem("premiumDemoShown", "true")
    setShowPremiumDemo(false)
  }

  return (
    <div className="min-h-screen bg-[#0F0C29] safe-area-inset">
      <DesktopNavigation />
      <main className="pb-32 md:pb-6 md:pl-64">
        <div className="container max-w-6xl mx-auto p-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">{children}</div>
      </main>
      <Navigation />

      <AnimatePresence>
        {showOnboarding && <OnboardingDemo onComplete={handleOnboardingComplete} />}
        {showPremiumDemo && <PremiumDemo onComplete={handlePremiumDemoComplete} />}
      </AnimatePresence>
    </div>
  )
}
