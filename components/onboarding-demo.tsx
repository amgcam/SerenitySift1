"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, Calendar, MessageCircle, TrendingUp, X } from "lucide-react"
import { modalBackdrop, slideInRight, slideInLeft } from "@/lib/animations"

const steps = [
  {
    title: "Welcome to SerenitySift!",
    description:
      "Easily track your mood with Serenity Sift's fun mood-logging feature! Just tap the Log tab to pick a feeling—like 'Happy' at 8/10—and add a little note. Keep your streak going, and let's make your journey even more joyful! 😊",
    icon: Sparkles,
    color: "from-soft-cyan to-soft-blue",
  },
  {
    title: "View Your History",
    description:
      "See your emotional journey in the History tab with a calendar view, mood icons, and stats like average intensity.",
    icon: Calendar,
    color: "from-soft-blue to-soft-purple",
  },
  {
    title: "Chat with AI",
    description:
      "Get wellness advice in the Chat tab. Ask questions like 'How to reduce stress?' and receive personalized tips.",
    icon: MessageCircle,
    color: "from-soft-purple to-soft-coral",
  },
  {
    title: "Get Basic Insights",
    description:
      "Track your mood trends in the Insights tab. See patterns like 'Your mood shows more calm days this week—keep it up!'",
    icon: TrendingUp,
    color: "from-soft-coral to-soft-cyan",
  },
  {
    title: "Ready to Start?",
    description:
      "You're all set! Upgrade to Premium anytime for advanced features like unlimited custom emotions and data export.",
    icon: Sparkles,
    color: "from-soft-cyan via-soft-blue to-soft-purple",
  },
]

interface OnboardingDemoProps {
  onComplete: () => void
}

export function OnboardingDemo({ onComplete }: OnboardingDemoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  const step = steps[currentStep]
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
        <div className="bg-deep-purple/80 backdrop-blur-xl border border-soft-cyan/20 rounded-2xl p-8 shadow-soft-glow">
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
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-soft-glow`}
                >
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-soft-text text-center leading-relaxed">{step.description}</p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 pt-4">
                {steps.map((_, index) => (
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
                          ? "bg-soft-cyan w-8"
                          : index < currentStep
                            ? "bg-soft-cyan/50"
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
                    className="flex-1 border-soft-cyan/20 text-soft-cyan hover:bg-soft-cyan/10 touch-target bg-transparent"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`${currentStep === 0 ? "w-full" : "flex-1"} bg-gradient-to-r ${step.color} text-white hover:opacity-90 shadow-soft-glow touch-target`}
                >
                  {currentStep === steps.length - 1 ? "Get Started" : "Next"}
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
