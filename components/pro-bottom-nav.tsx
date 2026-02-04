"use client"

import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, User, Sparkles } from 'lucide-react'

export function ProBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/pro",
      active: pathname === "/pro" || pathname === "/pro/dashboard",
    },
    {
      label: "Insights",
      icon: Sparkles,
      path: "/pro/insights",
      active: pathname === "/pro/insights",
    },
    {
      label: "Clients",
      icon: Users,
      path: "/pro",
      active: false,
    },
    {
      label: "Profile",
      icon: User,
      path: "/pro/profile",
      active: pathname === "/pro/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center p-2 min-h-[44px] min-w-[44px] transition-colors ${
                item.active ? "text-[#00D4FF]" : "text-gray-400 hover:text-[#00D4FF]"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
