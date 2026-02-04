"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  MessageSquare,
  Target,
  BarChart3,
  PlusCircle,
  Settings,
  Briefcase,
  User,
  MoreHorizontal,
  Sparkles,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { ProOnboardingModal } from "./pro-onboarding-modal"
import { MoreMenuModal } from "./more-menu-modal"

interface NavItem {
  href: string
  icon: any
  label: string
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/log",
    icon: PlusCircle,
    label: "Log",
  },
  {
    href: "/history",
    icon: Calendar,
    label: "History",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
  },
  {
    href: "/insights",
    icon: BarChart3,
    label: "Insights",
  },
  {
    href: "/subscription",
    icon: Target,
    label: "Premium",
  },
]

const desktopNavItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/log",
    icon: PlusCircle,
    label: "Log",
  },
  {
    href: "/dojo",
    icon: Zap,
    label: "Decision Dojo",
  },
  {
    href: "/concierge",
    icon: Sparkles,
    label: "AI Concierge",
  },
  {
    href: "/history",
    icon: Calendar,
    label: "History",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
  },
  {
    href: "/insights",
    icon: BarChart3,
    label: "Insights",
  },
  {
    href: "/subscription",
    icon: Target,
    label: "Premium",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
]

const mobileNavItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/history",
    icon: Calendar,
    label: "History",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
  },
  {
    href: "/insights",
    icon: BarChart3,
    label: "Insights",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neon-lime/20 bg-cyber-dark/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                  isActive
                    ? "text-neon-lime bg-neon-lime/10"
                    : "text-cyber-text hover:text-neon-lime hover:bg-neon-lime/5",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setShowMoreMenu(true)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
              "text-cyber-text hover:text-neon-lime hover:bg-neon-lime/5",
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      <MoreMenuModal isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} />
    </>
  )
}

export function DesktopNavigation() {
  const pathname = usePathname()
  const [showProOnboarding, setShowProOnboarding] = useState(false)

  const handleProClick = () => {
    const isPro = localStorage.getItem("isProfessional") === "true"
    if (isPro) {
      window.location.href = "/pro"
    } else {
      setShowProOnboarding(true)
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("isProfessional", "true")
    setShowProOnboarding(false)
    window.location.href = "/pro"
  }

  return (
    <>
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl flex-col p-6">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.png" alt="SerenitySift Logo" width={48} height={48} className="rounded-xl" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
              SerenitySift
            </h1>
            <p className="text-sm text-soft-text">Emotional Wellness</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "text-soft-cyan bg-soft-cyan/10 shadow-soft-glow"
                    : "text-soft-text hover:text-soft-cyan hover:bg-soft-cyan/5",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={handleProClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left",
              pathname.startsWith("/pro")
                ? "text-soft-cyan bg-soft-cyan/10 shadow-soft-glow"
                : "text-soft-text hover:text-soft-cyan hover:bg-soft-cyan/5",
            )}
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Pro Mode</span>
          </button>
        </div>
      </nav>

      <ProOnboardingModal
        isOpen={showProOnboarding}
        onClose={() => setShowProOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  )
}
