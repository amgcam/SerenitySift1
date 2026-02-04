"use client"

import { motion } from "framer-motion"

export function AnimatedFlame({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main flame - Apple emoji style */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Outer flame (bright orange) - teardrop shape */}
        <motion.path
          d="M12 2C12 2 8 5 7 10C6.5 13 7 16 9 18C10 19 11 19.5 12 19.5C13 19.5 14 19 15 18C17 16 17.5 13 17 10C16 5 12 2 12 2Z"
          fill="url(#flameGradientOuter)"
          animate={{
            d: [
              "M12 2C12 2 8 5 7 10C6.5 13 7 16 9 18C10 19 11 19.5 12 19.5C13 19.5 14 19 15 18C17 16 17.5 13 17 10C16 5 12 2 12 2Z",
              "M12 2C12 2 8 5 7 10.5C6.5 13.5 7 16.5 9 18.5C10 19.5 11 20 12 20C13 20 14 19.5 15 18.5C17 16.5 17.5 13.5 17 10.5C16 5 12 2 12 2Z",
              "M12 2C12 2 8 5 7 10C6.5 13 7 16 9 18C10 19 11 19.5 12 19.5C13 19.5 14 19 15 18C17 16 17.5 13 17 10C16 5 12 2 12 2Z",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Inner flame (red-orange) - more rounded and prominent */}
        <motion.path
          d="M12 5C12 5 9.5 7.5 9 11C8.7 13 9 15 10.5 16.5C11 17 11.5 17.5 12 17.5C12.5 17.5 13 17 13.5 16.5C15 15 15.3 13 15 11C14.5 7.5 12 5 12 5Z"
          fill="url(#flameGradientInner)"
          animate={{
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* Core flame (bright yellow) - larger and more visible */}
        <motion.path
          d="M12 8C12 8 10.5 10 10.5 12C10.5 13.5 11 14.5 12 14.5C13 14.5 13.5 13.5 13.5 12C13.5 10 12 8 12 8Z"
          fill="url(#flameGradientCore)"
          animate={{
            opacity: [0.95, 1, 0.95],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ transformOrigin: "center" }}
        />

        <defs>
          <linearGradient id="flameGradientOuter" x1="12" y1="2" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="40%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FFB84D" />
          </linearGradient>
          <linearGradient id="flameGradientInner" x1="12" y1="5" x2="12" y2="17.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="50%" stopColor="#FF5733" />
            <stop offset="100%" stopColor="#FF8D1A" />
          </linearGradient>
          <linearGradient id="flameGradientCore" x1="12" y1="8" x2="12" y2="14.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="50%" stopColor="#FFEB3B" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
        </defs>
      </motion.svg>

      <motion.div
        className="absolute inset-0 blur-xl"
        animate={{
          opacity: [0.5, 0.7, 0.5],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(255,107,53,0.8) 0%, rgba(255,140,66,0.4) 50%, transparent 70%)",
          transformOrigin: "center",
        }}
      />
    </div>
  )
}
