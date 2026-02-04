"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Crown, Sparkles, Download, Palette, X } from "lucide-react"
import { modalBackdrop, slideInRight, slideInLeft } from "@/lib/animations"

const premiumSteps = [
  {
    title: "Welcome to Premium!",
    description:
      "Get in-depth AI feedback in Insights with detailed charts. Example: 'Your anxiety spikes on Mondays—try this routine.'",
    icon: Crown,
    color: "from-soft-orange to-soft-coral",
  },
  {
    title: "Unlimited Custom Emotions",
    description:
      "Add any emotion beyond basic presets in the Log tab. Create custom emotions like 'Euphoric' or 'Melancholy.'",
    icon: Sparkles,
    color: "from-soft-coral to-soft-pink",
  },
  {
    title: "Export Your Data",
    description:
      "Download your mood data as PDF or CSV from History or Insights. Perfect for therapy sessions or personal records.",
    icon: Download,
    color: "from-soft-pink to-soft-purple",
  },
  {
    title: "Unlock Premium Themes",
    description: "Switch between Cyberpunk, Light Mode, and Nature themes. Preview color swatches in the Themes Pack.",
    icon: Palette,
    color: "from-soft-purple to-soft-cyan",
  },
  {
    title: "Enjoy Premium!",
    description:
      "Your subscription unlocks everything—explore all features and make the most of your mental wellness journey!",
    icon: Crown,
    color: "from-soft-cyan via-soft-blue to-soft-purple",
  },
]

interface PremiumDemoProps {
  onComplete: () => void
}

export function PremiumDemo({ onComplete }: PremiumDemoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    if (currentStep < premiumSteps.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = premiumSteps[currentStep]
  const Icon = step.icon

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-cyber-darker/95 backdrop-blur-md safe-area-inset"
      variants={modalBackdrop}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="w-full max-w-md">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-soft-text hover:text-white touch-target"
          >
            <X className="w-4 h-4 mr-1" />
            Skip
          </Button>
        </div>

        {/* Content card */}
        <div className="bg-deep-purple/80 backdrop-blur-xl border border-soft-orange/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,127,127,0.3)]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={direction > 0 ? slideInRight : slideInLeft}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-[0_0_30px_rgba(255,127,127,0.4)]`}
                >
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-soft-orange via-soft-coral to-soft-pink bg-clip-text text-transparent">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-soft-text text-center leading-relaxed">{step.description}</p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 pt-4">
                {premiumSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentStep ? 1 : -1)
                      setCurrentStep(index)
                    }}
                    className="touch-target"
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-soft-coral w-8"
                          : index < currentStep
                            ? "bg-soft-coral/50"
                            : "bg-soft-text/30"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 border-soft-coral/20 text-soft-coral hover:bg-soft-coral/10 touch-target bg-transparent"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`${currentStep === 0 ? "w-full" : "flex-1"} bg-gradient-to-r ${step.color} text-white hover:opacity-90 shadow-[0_0_20px_rgba(255,127,127,0.3)] touch-target`}
                >
                  {currentStep === premiumSteps.length - 1 ? "Enjoy Premium!" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
