"use client"

import type { Variants } from "framer-motion"

// Spring physics configurations
export const springConfigs = {
  gentle: { type: "spring" as const, stiffness: 100, damping: 15 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
  snappy: { type: "spring" as const, stiffness: 500, damping: 30 },
}

// Reusable animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
}

// Staggered children animation
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 30, rotate: -2 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: springConfigs.bouncy,
  },
}

// Card animations
export const cardHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
}

// Button animations
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
}

// Tab animations
export const tabActive: Variants = {
  inactive: { scale: 1, opacity: 0.7, y: 2 },
  active: {
    scale: 1.1,
    opacity: 1,
    y: 0,
    transition: springConfigs.bouncy,
  },
}

// Emoji/Icon animations
export const emojiSelect: Variants = {
  unselected: { scale: 0.85, opacity: 0.6 },
  selected: {
    scale: 1.4,
    opacity: 1,
    transition: springConfigs.bouncy,
  },
}

// Sparkle effect keyframes
export const sparkleAnimation = {
  initial: { opacity: 0, scale: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0.5],
    y: [-20, -40, -60],
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

// Breathing animation
export const breathe = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

// Pulse animation
export const pulse = {
  scale: [1, 1.1, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 0.6,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

// Shimmer loading animation
export const shimmer = {
  backgroundPosition: ["200% 0", "-200% 0"],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear",
  },
}

// Confetti particle animation
export const confettiParticle = (index: number) => ({
  initial: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
  },
  animate: {
    opacity: [1, 1, 0],
    scale: [1, 1.2, 0.8],
    x: Math.cos((index / 20) * Math.PI * 2) * (100 + Math.random() * 100),
    y: Math.sin((index / 20) * Math.PI * 2) * (100 + Math.random() * 100) - 200,
    rotate: Math.random() * 720 - 360,
    transition: {
      duration: 1.5 + Math.random(),
      ease: "easeOut",
    },
  },
})

// Typing indicator dots
export const typingDot = (index: number) => ({
  scale: [0.4, 1.3, 0.6],
  y: [0, -8, 0],
  transition: {
    duration: 0.5,
    repeat: Number.POSITIVE_INFINITY,
    delay: index * 0.15,
    ease: "easeInOut",
  },
})

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

// Modal/Dialog animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfigs.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

// Progress ring animation
export const progressRing = (progress: number) => ({
  pathLength: progress / 100,
  transition: {
    duration: 1.8,
    ease: "easeOut",
  },
})

// Number counter animation helper
export function animateNumber(from: number, to: number, duration: number, onUpdate: (value: number) => void) {
  const startTime = Date.now()
  const animate = () => {
    const now = Date.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / (duration * 1000), 1)

    // Easing function (easeOutQuart)
    const eased = 1 - Math.pow(1 - progress, 4)
    const current = from + (to - from) * eased

    onUpdate(Math.round(current * 10) / 10)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}
