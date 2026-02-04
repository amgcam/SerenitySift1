"use client"

import { Slider } from "@/components/ui/slider"

interface IntensitySliderProps {
  value: number
  onChange: (value: number) => void
}

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-cyber-text">Intensity</span>
        <span className="text-2xl font-bold text-neon-lime">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-8 rounded transition-all",
              i < value ? "bg-neon-lime shadow-neon-lime" : "bg-cyber-text/20",
            )}
          />
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
