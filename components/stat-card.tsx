import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { AnimatedFlame } from "./animated-flame"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: "cyan" | "coral" | "purple"
}

export function StatCard({ title, value, icon: Icon, color = "cyan" }: StatCardProps) {
  const colorClasses = {
    cyan: "text-soft-cyan border-soft-cyan/20 bg-soft-cyan/5",
    coral: "text-neon-coral border-neon-coral/20 bg-neon-coral/5",
    purple: "text-soft-purple border-soft-purple/20 bg-soft-purple/5",
  }

  const isStreakCard = title === "Current Streak"

  return (
    <Card className={`border backdrop-blur ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyber-text mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {isStreakCard ? <AnimatedFlame className="w-14 h-14" /> : <Icon className="w-10 h-10 opacity-50 text-card" />}
        </div>
      </CardContent>
    </Card>
  )
}
