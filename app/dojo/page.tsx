"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Sparkles, Search, Trophy, Lock, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const MonolineIcon = ({ category, className = "" }: { category: string; className?: string }) => {
  const icons = {
    fitness: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 24L18 18M18 18L22 22M18 18V32M30 18L36 24M30 18L26 22M30 18V32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 12C24 12 26 14 26 18C26 22 24 24 24 24M24 36C24 36 22 34 22 30C22 26 24 24 24 24M24 24H24.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 12V24M16 24C16 26.2091 14.2091 28 12 28V36M16 24C16 26.2091 17.7909 28 20 28V36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 12C28 12 28 18 28 22C28 26 32 28 32 28M32 12V36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    leisure: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 14H34V34H14V14Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 14V34M30 14V34M14 20H34M14 28H34"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    travel: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 12L12 24L24 28L28 40L40 28L36 16L24 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    shopping: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 14H36L34 34H14L12 14Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 14C16 12 18 8 24 8C30 8 32 12 32 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    entertainment: (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 16H36V34H12V16Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 22L28 25L20 28V22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }
  return icons[category as keyof typeof icons] || icons.leisure
}

interface DecisionOption {
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: number // 1-3, representing basic -> specific -> granular
  trainingFocus: string // What this decision teaches
}

const allDecisions: DecisionOption[] = [
  // Fitness - Level 1: Basic
  {
    id: "run-1",
    title: "Morning Run",
    subtitle: "30 min outdoor jog",
    category: "fitness",
    difficulty: 1,
    trainingFocus: "Outdoor activities & morning energy",
  },
  {
    id: "yoga-1",
    title: "Yoga Session",
    subtitle: "Gentle stretching flow",
    category: "fitness",
    difficulty: 1,
    trainingFocus: "Flexibility & mindfulness",
  },
  {
    id: "gym-1",
    title: "Gym Workout",
    subtitle: "Weight training session",
    category: "fitness",
    difficulty: 1,
    trainingFocus: "Indoor vs outdoor preference",
  },

  // Fitness - Level 2: Specific
  {
    id: "run-2",
    title: "Intense Sprint Training",
    subtitle: "20 min HIIT running",
    category: "fitness",
    difficulty: 2,
    trainingFocus: "Intensity vs duration preference",
  },
  {
    id: "run-3",
    title: "Long Distance Run",
    subtitle: "60 min steady pace",
    category: "fitness",
    difficulty: 2,
    trainingFocus: "Quick intense vs long moderate",
  },
  {
    id: "yoga-2",
    title: "Power Yoga",
    subtitle: "45 min intense flow",
    category: "fitness",
    difficulty: 2,
    trainingFocus: "Gentle vs intense workout style",
  },

  // Fitness - Level 3: Granular
  {
    id: "run-4",
    title: "6 AM Park Run",
    subtitle: "Early morning, social group",
    category: "fitness",
    difficulty: 3,
    trainingFocus: "Timing & social dynamics",
  },
  {
    id: "run-5",
    title: "Evening Solo Run",
    subtitle: "After work, reflective time",
    category: "fitness",
    difficulty: 3,
    trainingFocus: "Solo vs group exercise",
  },

  // Food - Level 1: Basic
  {
    id: "cafe-1",
    title: "Quick Cafe Lunch",
    subtitle: "Healthy salad bowl",
    category: "food",
    difficulty: 1,
    trainingFocus: "Quick service & healthy options",
  },
  {
    id: "restaurant-1",
    title: "Fine Dining",
    subtitle: "Multi-course meal",
    category: "food",
    difficulty: 1,
    trainingFocus: "Ambiance & quality ingredients",
  },
  {
    id: "home-1",
    title: "Home Cooking",
    subtitle: "Prepare your own meal",
    category: "food",
    difficulty: 1,
    trainingFocus: "DIY vs eating out",
  },

  // Food - Level 2: Specific
  {
    id: "cafe-2",
    title: "Organic Smoothie Bowl",
    subtitle: "$12, 15 min wait",
    category: "food",
    difficulty: 2,
    trainingFocus: "Health vs convenience balance",
  },
  {
    id: "cafe-3",
    title: "Deli Sandwich",
    subtitle: "$8, instant pickup",
    category: "food",
    difficulty: 2,
    trainingFocus: "Budget & time constraints",
  },

  // Food - Level 3: Granular
  {
    id: "pizza-1",
    title: "Artisan Margherita",
    subtitle: "Wood-fired, classic",
    category: "food",
    difficulty: 3,
    trainingFocus: "Subtle flavor preferences",
  },
  {
    id: "pizza-2",
    title: "Loaded Meat Pizza",
    subtitle: "Multiple toppings",
    category: "food",
    difficulty: 3,
    trainingFocus: "Simple vs complex flavors",
  },

  // Leisure - Level 1: Basic
  {
    id: "book-1",
    title: "Read Novel",
    subtitle: "Fiction book at home",
    category: "leisure",
    difficulty: 1,
    trainingFocus: "Deep focus & storytelling",
  },
  {
    id: "movie-1",
    title: "Watch Movie",
    subtitle: "2 hour film",
    category: "leisure",
    difficulty: 1,
    trainingFocus: "Visual entertainment",
  },
  {
    id: "walk-1",
    title: "Nature Walk",
    subtitle: "Outdoor stroll",
    category: "leisure",
    difficulty: 1,
    trainingFocus: "Active vs passive relaxation",
  },

  // Leisure - Level 2: Specific
  {
    id: "book-2",
    title: "Mystery Thriller",
    subtitle: "Page-turner novel",
    category: "leisure",
    difficulty: 2,
    trainingFocus: "Genre preferences",
  },
  {
    id: "book-3",
    title: "Non-Fiction",
    subtitle: "Educational reading",
    category: "leisure",
    difficulty: 2,
    trainingFocus: "Entertainment vs learning",
  },

  // Travel - Level 1: Basic (Locked initially)
  {
    id: "travel-1",
    title: "Beach Vacation",
    subtitle: "Relaxation & sun",
    category: "travel",
    difficulty: 1,
    trainingFocus: "Leisure vs adventure travel",
  },
  {
    id: "travel-2",
    title: "Mountain Hiking",
    subtitle: "Active adventure",
    category: "travel",
    difficulty: 1,
    trainingFocus: "Activity level preferences",
  },

  // Shopping - Level 1: Basic (Locked initially)
  {
    id: "shop-1",
    title: "Online Shopping",
    subtitle: "Browse from home",
    category: "shopping",
    difficulty: 1,
    trainingFocus: "Convenience vs experience",
  },
  {
    id: "shop-2",
    title: "In-Store Shopping",
    subtitle: "Physical retail",
    category: "shopping",
    difficulty: 1,
    trainingFocus: "Tactile shopping preference",
  },

  // Entertainment - Level 1: Basic (Locked initially)
  {
    id: "ent-1",
    title: "Live Concert",
    subtitle: "Music venue",
    category: "entertainment",
    difficulty: 1,
    trainingFocus: "Live vs recorded entertainment",
  },
  {
    id: "ent-2",
    title: "Streaming at Home",
    subtitle: "Cozy night in",
    category: "entertainment",
    difficulty: 1,
    trainingFocus: "Social vs solo entertainment",
  },
]

const categoryUnlocks = [
  { level: 1, categories: ["fitness", "food", "leisure"], unlockAt: 0 },
  { level: 2, categories: ["travel", "shopping", "entertainment"], unlockAt: 15 },
]

interface UserProgress {
  totalDecisions: number
  level: number
  categoryProgress: Record<string, number>
  unlockedCategories: string[]
  streak: number
  insights: string[]
}

function OnboardingOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Your Decision Dojo",
      description: "Train your personal AI to understand your unique preferences",
    },
    {
      title: "How It Works",
      description:
        "Swipe right on choices you'd prefer, left on ones you wouldn't. There are no wrong answers - only your preferences.",
    },
    {
      title: "The More You Train",
      description: "The smarter your recommendations become. Each swipe builds your personal decision engine.",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-soft-cyan/20 to-soft-blue/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-lg w-full relative"
      >
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-soft-cyan/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-soft-cyan" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
            <p className="text-soft-text text-lg">{steps[step].description}</p>
          </div>

          <div className="flex gap-2 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-soft-cyan" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1)
                } else {
                  onComplete()
                }
              }}
              className="flex-1 bg-soft-cyan hover:bg-soft-cyan/90 text-white"
            >
              {step < steps.length - 1 ? "Next" : "Start Training"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MilestoneCelebration({
  milestone,
  onClose,
}: { milestone: { title: string; description: string; icon: string }; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-gradient-to-br from-soft-purple/20 to-soft-coral/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          {milestone.icon}
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">{milestone.title}</h2>
        <p className="text-soft-text mb-6">{milestone.description}</p>
        <Button onClick={onClose} className="bg-soft-cyan hover:bg-soft-cyan/90 text-white">
          Continue Training
        </Button>
      </motion.div>
    </motion.div>
  )
}

function SwipeCard({
  option,
  onSwipe,
  isActive,
  index,
  progress,
}: {
  option: DecisionOption
  onSwipe: (direction: "left" | "right") => void
  isActive: boolean
  index: number
  progress: UserProgress
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x > 0 ? "right" : "left")
    }
  }

  const showAdvancedInfo = progress.categoryProgress[option.category] >= 5

  return (
    <motion.div
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: isActive ? 1 : 0.95 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: isActive ? 1.02 : 0.95, cursor: "grabbing" }}
      className={`absolute inset-0 ${isActive ? "cursor-grab" : "pointer-events-none"}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 h-full transition-all hover:border-soft-cyan/50 hover:shadow-soft-glow">
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-soft-cyan/10 to-soft-blue/10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MonolineIcon category={option.category} className="w-24 h-24 text-white" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{option.title}</h3>
              <p className="text-sm text-soft-text mt-1">{option.subtitle}</p>
            </div>
            <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30 shrink-0">
              {option.category}
            </Badge>
          </div>

          {/* Training Context */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 p-3 rounded-lg bg-soft-cyan/10 border border-soft-cyan/20"
          >
            <Sparkles className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-soft-cyan font-medium mb-1">Training your AI to understand:</p>
              <p className="text-sm text-white/80">{option.trainingFocus}</p>
            </div>
          </motion.div>

          {/* Difficulty indicator */}
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < option.difficulty ? "bg-soft-cyan" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DecisionDojoPage() {
  const [progress, setProgress] = useState<UserProgress>({
    totalDecisions: 0,
    level: 1,
    categoryProgress: {},
    unlockedCategories: ["fitness", "food", "leisure"],
    streak: 0,
    insights: [],
  })
  const [currentCards, setCurrentCards] = useState<DecisionOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [milestone, setMilestone] = useState<{ title: string; description: string; icon: string } | null>(null)

  useEffect(() => {
    const savedProgress = localStorage.getItem("dojoProgress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    } else {
      // First time user
      setShowOnboarding(!localStorage.getItem("dojoOnboardingComplete"))
    }

    // Initialize first cards
    const initialCards = allDecisions
      .filter((d) => ["fitness", "food", "leisure"].includes(d.category) && d.difficulty === 1)
      .slice(0, 2)
    setCurrentCards(initialCards)
  }, [])

  useEffect(() => {
    if (progress.totalDecisions > 0) {
      localStorage.setItem("dojoProgress", JSON.stringify(progress))
    }
  }, [progress])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem("dojoOnboardingComplete", "true")
  }

  const handleSwipe = (direction: "left" | "right", option: DecisionOption) => {
    // Save choice
    const choices = JSON.parse(localStorage.getItem("userChoices") || "[]")
    choices.push({
      id: option.id,
      category: option.category,
      direction,
      timestamp: new Date().toISOString(),
      difficulty: option.difficulty,
    })
    localStorage.setItem("userChoices", JSON.stringify(choices))

    // Update progress
    const newProgress = { ...progress }
    newProgress.totalDecisions += 1
    newProgress.streak += 1
    newProgress.categoryProgress[option.category] = (newProgress.categoryProgress[option.category] || 0) + 1

    // Calculate level based on total decisions
    const newLevel = Math.floor(newProgress.totalDecisions / 10) + 1
    if (newLevel > newProgress.level) {
      newProgress.level = newLevel
    }

    // Check for category unlocks
    categoryUnlocks.forEach((unlock) => {
      if (newProgress.totalDecisions === unlock.unlockAt && unlock.level > 1) {
        newProgress.unlockedCategories = [...new Set([...newProgress.unlockedCategories, ...unlock.categories])]
        setMilestone({
          title: "New Categories Unlocked!",
          description: `You can now explore ${unlock.categories.join(", ")} preferences`,
          icon: "🎉",
        })
      }
    })

    // Check for milestone achievements
    if (newProgress.totalDecisions === 10) {
      const topCategory = Object.entries(newProgress.categoryProgress).sort((a, b) => b[1] - a[1])[0]
      newProgress.insights.push(`You prefer ${topCategory[0]} activities`)
      setMilestone({
        title: "First Milestone!",
        description: `You've completed 10 decisions. Your AI is learning your ${topCategory[0]} preferences.`,
        icon: "🏆",
      })
    } else if (newProgress.totalDecisions === 25) {
      setMilestone({
        title: "Training Expert",
        description: "Your profile is getting stronger! Advanced recommendations unlocked.",
        icon: "⚡",
      })
    }

    setProgress(newProgress)

    // Get next card based on difficulty progression
    const categoryDecisions = allDecisions.filter(
      (d) =>
        newProgress.unlockedCategories.includes(d.category) &&
        (selectedCategory === "all" || d.category === selectedCategory),
    )

    // Progress to harder decisions as user gains experience
    const categoryExp = newProgress.categoryProgress[option.category] || 0
    const targetDifficulty = Math.min(Math.floor(categoryExp / 5) + 1, 3)

    const availableCards = categoryDecisions.filter(
      (d) => d.difficulty <= targetDifficulty && !currentCards.some((c) => c.id === d.id),
    )

    if (availableCards.length > 0) {
      const nextCard = availableCards[Math.floor(Math.random() * availableCards.length)]
      setCurrentCards([currentCards[1], nextCard])
    } else {
      // Reset with new difficulty level
      const resetCards = categoryDecisions.filter((d) => d.difficulty === targetDifficulty).slice(0, 2)
      setCurrentCards(resetCards)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentCards.length > 0) {
        if (e.key === "ArrowLeft") {
          handleSwipe("left", currentCards[0])
        } else if (e.key === "ArrowRight") {
          handleSwipe("right", currentCards[0])
        }
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentCards])

  const profileStrength = Math.min(Math.floor((progress.totalDecisions / 60) * 100), 100)
  const nextUnlock = categoryUnlocks.find((u) => progress.totalDecisions < u.unlockAt)

  return (
    <DashboardLayout>
      <AnimatePresence>
        {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}
        {milestone && <MilestoneCelebration milestone={milestone} onClose={() => setMilestone(null)} />}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-soft-cyan/10 to-soft-blue/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-soft-cyan" />
                <h2 className="text-2xl font-bold text-white">Decision Training: Level {progress.level}</h2>
              </div>
              <p className="text-soft-text">Profile Strength: {profileStrength}%</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-soft-cyan" />
              <span className="text-white font-medium">{progress.streak} decisions</span>
            </div>
          </div>

          <Progress value={profileStrength} className="h-2 mb-4" />

          {nextUnlock && (
            <div className="flex items-center gap-2 text-sm text-soft-text">
              <Lock className="w-4 h-4" />
              <span>
                Next: Unlock {nextUnlock.categories.join(", ")} at {nextUnlock.unlockAt} decisions
              </span>
            </div>
          )}

          {progress.insights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-soft-cyan font-medium mb-1">Your AI has learned:</p>
                  <p className="text-sm text-white">{progress.insights[progress.insights.length - 1]}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Decision Dojo</h1>
            <p className="text-soft-text mt-2">Train your personal AI to understand your preferences</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {["fitness", "food", "leisure", "travel", "shopping", "entertainment"].map((category) => {
              const isUnlocked = progress.unlockedCategories.includes(category)
              const categoryCount = progress.categoryProgress[category] || 0
              const categoryLevel = categoryCount >= 15 ? "Detailed" : categoryCount >= 5 ? "Basic" : "Unexplored"

              return (
                <div
                  key={category}
                  className={`p-3 rounded-lg border ${
                    isUnlocked ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <MonolineIcon category={category} className="w-6 h-6 text-white" />
                    {!isUnlocked && <Lock className="w-3 h-3 text-white/40" />}
                  </div>
                  <p className="text-sm font-medium text-white capitalize">{category}</p>
                  <p className="text-xs text-soft-text">{isUnlocked ? categoryLevel : "Locked"}</p>
                </div>
              )
            })}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-text" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search decisions..."
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-soft-text"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", ...progress.unlockedCategories].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === category
                      ? "bg-soft-cyan text-white"
                      : "bg-transparent border-white/10 text-soft-text hover:text-white"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-[600px] max-w-md mx-auto">
          <AnimatePresence>
            {currentCards.slice(0, 2).map((option, index) => (
              <SwipeCard
                key={option.id}
                option={option}
                onSwipe={(direction) => handleSwipe(direction, option)}
                isActive={index === 0}
                index={index}
                progress={progress}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center space-y-2">
          <p className="text-soft-text text-sm font-medium">Swipe right if you'd choose this, left if you wouldn't</p>
          <p className="text-soft-text/60 text-xs">There are no wrong answers - only your preferences</p>
          <p className="text-soft-text/60 text-xs">Use arrow keys for keyboard control</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
