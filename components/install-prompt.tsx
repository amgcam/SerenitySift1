"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem("pwa-install-dismissed")
      if (!dismissed) {
        setShowPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    console.log("[v0] PWA install outcome:", outcome)

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-[#00D4FF] to-[#2A0A3D] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm mx-4">
        <Download className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-sm">Install Serenity Sift</p>
          <p className="text-xs opacity-90">Access offline & get notifications</p>
        </div>
        <Button onClick={handleInstall} size="sm" className="bg-white text-[#2A0A3D] hover:bg-gray-100 font-bold">
          Add
        </Button>
        <button onClick={handleDismiss} className="text-white/80 hover:text-white" aria-label="Dismiss">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
