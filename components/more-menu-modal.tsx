"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Target, Settings, User, X, Zap, Sparkles, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MoreMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

const moreItems = [
  {
    href: "/log",
    icon: PlusCircle,
    label: "Log Mood",
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

export function MoreMenuModal({ isOpen, onClose }: MoreMenuModalProps) {
  const pathname = usePathname()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-deep-purple border-soft-cyan/20 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-soft-cyan flex items-center justify-between">
            More Options
            <button
              onClick={onClose}
              className="text-soft-text hover:text-soft-cyan transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {moreItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
