"use client"

import { cn } from "@/lib/utils"
import { Smile, Zap, Heart, CloudRain, Flame, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

const emotions = [
  { value: "happy", label: "Happy", icon: Smile, color: "soft-cyan" },
  { value: "sad", label: "Sad", icon: CloudRain, color: "soft-blue" },
  { value: "anxious", label: "Anxious", icon: Zap, color: "soft-coral" },
  { value: "calm", label: "Calm", icon: Heart, color: "soft-purple" },
  { value: "angry", label: "Angry", icon: Flame, color: "warm-orange" },
  { value: "excited", label: "Excited", icon: Zap, color: "soft-cyan" },
  { value: "custom", label: "Custom", icon: Pencil, color: "soft-purple" },
]

interface MoodSelectorProps {
  selected: string
  onSelect: (emotion: string) => void
  customEmotion?: string
  onCustomEmotionChange?: (value: string) => void
}

export function MoodSelector({ selected, onSelect, customEmotion, onCustomEmotionChange }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {emotions.map((emotion) => {
          const Icon = emotion.icon
          const isSelected = selected === emotion.value
          const isCustom = emotion.value === "custom"
          return (
            <button
              key={emotion.value}
              type="button"
              onClick={() => onSelect(emotion.value)}
              className={cn(
                "flex flex-col items-center p-6 rounded-lg transition-all border-2 gap-3",
                isCustom && "col-span-2 md:col-span-2",
                isSelected
                  ? `border-${emotion.color} bg-${emotion.color}/10 shadow-soft-glow`
                  : "border-soft-text/20 bg-deep-purple/50 text-soft-text hover:border-soft-text/40",
              )}
            >
              <Icon
                className={cn(
                  "w-8 h-8",
                  isSelected
                    ? "text-transparent bg-gradient-to-br from-warm-orange via-soft-coral via-soft-purple via-soft-blue to-soft-cyan bg-clip-text [&>*]:fill-transparent [&>*]:stroke-[url(#icon-gradient)]"
                    : "",
                )}
              />
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB84D" />
                    <stop offset="25%" stopColor="#FF8BA0" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="75%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <span
                className={cn(
                  "font-medium",
                  isSelected
                    ? "bg-gradient-to-r from-warm-orange via-soft-coral via-soft-purple via-soft-blue to-soft-cyan bg-clip-text text-transparent"
                    : "",
                )}
              >
                {emotion.label}
              </span>
            </button>
          )
        })}
      </div>

      {selected === "custom" && (
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter your custom emotion..."
            value={customEmotion || ""}
            onChange={(e) => onCustomEmotionChange?.(e.target.value)}
            className="border-soft-purple/30 bg-deep-purple/50 text-white placeholder:text-soft-text/50 focus:border-soft-purple"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}
