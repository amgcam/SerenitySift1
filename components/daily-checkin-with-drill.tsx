"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

type Mood = "sad" | "neutral" | "happy" | "excited" | "anxious"
type Phase = "mood" | "drill" | "complete"

interface DecisionOption {
  id: string
  text: string
  image: string
}

const decisions: DecisionOption[][] = [
  [
    { id: "book", text: "Read a book", image: "/person-reading.png" },
    { id: "podcast", text: "Listen to podcast", image: "/person-with-headphones.png" },
  ],
  [
    { id: "walk", text: "Go for a walk", image: "/person-walking-outdoors.jpg" },
    { id: "meditate", text: "Meditate", image: "/person-meditating.png" },
  ],
  [
    { id: "call", text: "Call a friend", image: "/person-on-phone-call.png" },
    { id: "journal", text: "Write in journal", image: "/person-writing-journal.jpg" },
  ],
  [
    { id: "exercise", text: "Exercise", image: "/person-exercising.png" },
    { id: "cook", text: "Cook a meal", image: "/person-cooking.png" },
  ],
  [
    { id: "music", text: "Play music", image: "/person-playing-guitar.jpg" },
    { id: "art", text: "Create art", image: "/person-painting.png" },
  ],
]

export default function DailyCheckinWithDrill() {
  const [phase, setPhase] = useState<Phase>("mood")
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0)
  const [drillChoices, setDrillChoices] = useState<string[]>([])
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const moods: { emoji: string; value: Mood }[] = [
    { emoji: "😢", value: "sad" },
    { emoji: "😐", value: "neutral" },
    { emoji: "😊", value: "happy" },
    { emoji: "🥳", value: "excited" },
    { emoji: "😰", value: "anxious" },
  ]

  useEffect(() => {
    if (selectedMood && phase === "drill") {
      localStorage.setItem("lastMood", selectedMood)
      localStorage.setItem("lastMoodDate", new Date().toISOString())
    }
  }, [selectedMood, phase])

  useEffect(() => {
    if (phase === "complete" && drillChoices.length === 5) {
      localStorage.setItem("lastDrillChoices", JSON.stringify(drillChoices))
      localStorage.setItem("lastDrillDate", new Date().toISOString())
    }
  }, [phase, drillChoices])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      analyser.fftSize = 256
      source.connect(analyser)

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      visualizeAudio()
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const animate = () => {
      if (!analyserRef.current) return
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood)
    setTimeout(() => {
      setPhase("drill")
    }, 800)
  }

  const handleDrillChoice = (choice: string) => {
    setDrillChoices([...drillChoices, choice])

    if (currentDrillIndex < decisions.length - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1)
    } else {
      setPhase("complete")
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00D4FF", "#FF8BA0"],
      })
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    const choice = direction === "left" ? decisions[currentDrillIndex][0].id : decisions[currentDrillIndex][1].id
    handleDrillChoice(choice)
  }

  return (
    <div className="min-h-screen bg-[#2A0A3D] flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {phase === "mood" && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="text-center space-y-8">
              <h1
                className="text-4xl font-bold text-white"
                style={{
                  textShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
                }}
              >
                How are you feeling today?
              </h1>

              <div className="flex justify-center gap-4 flex-wrap">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`w-20 h-20 text-5xl rounded-2xl transition-all touch-target ${
                      selectedMood === mood.value
                        ? "border-4 border-[#00D4FF] shadow-[0_0_16px_#00D4FF]"
                        : "border-2 border-white/10"
                    }`}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(12px)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mood.emoji}
                    {selectedMood === mood.value && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl mt-2"
                      >
                        🔥
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {selectedMood && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="px-6 py-3 rounded-full border-2 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-white transition-all flex items-center gap-2 mx-auto touch-target"
                    style={{
                      boxShadow: isRecording ? "0 0 16px #00D4FF" : "none",
                    }}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecording ? "Stop Recording" : "Add Voice Note"}
                  </button>

                  {isRecording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-[#00D4FF] rounded-full"
                          animate={{
                            height: [4, audioLevel * 40 + 4, 4],
                          }}
                          transition={{
                            duration: 0.3,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.05,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {phase === "drill" && (
          <motion.div
            key="drill"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-3xl font-bold text-white mb-2"
                  style={{
                    borderBottom: "2px solid #00D4FF",
                    display: "inline-block",
                    paddingBottom: "8px",
                  }}
                >
                  Quick Decision Drill
                </h2>
                <p className="text-[#E0E7FF] mt-4">Choose one option</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00D4FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentDrillIndex + 1) / decisions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-center text-[#E0E7FF]">
                {currentDrillIndex + 1} / {decisions.length}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {decisions[currentDrillIndex].map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleDrillChoice(option.id)}
                    className="group relative overflow-hidden rounded-2xl p-6 touch-target"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(12px)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 16px #00D4FF",
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={option.image || "/placeholder.svg"}
                      alt={option.text}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-xl font-semibold text-white">{option.text}</h3>

                    {/* Coral accent on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF8BA0]/0 to-[#FF8BA0]/0 group-hover:from-[#FF8BA0]/10 group-hover:to-[#FF8BA0]/5 transition-all rounded-2xl" />
                  </motion.button>
                ))}
              </div>

              {/* Arrow navigation */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => handleSwipe("left")}
                  className="p-4 rounded-full bg-[#00D4FF] text-white hover:shadow-[0_0_16px_#00D4FF] transition-all touch-target"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  className="p-4 rounded-full bg-[#00D4FF] text-white hover:shadow-[0_0_16px_#00D4FF] transition-all touch-target"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl text-center"
          >
            <div className="space-y-8">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                <Sparkles className="w-24 h-24 text-[#00D4FF] mx-auto" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white">Great job!</h2>

              <p className="text-xl text-[#E0E7FF]">You've trained your decision muscle</p>

              <motion.a
                href="/dashboard"
                className="inline-block px-8 py-4 rounded-full bg-[#00D4FF] text-white font-semibold hover:shadow-[0_0_20px_#00D4FF] transition-all touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Today's Insights
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "drill" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FF8BA0] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20,
                opacity: 0,
              }}
              animate={{
                y: -20,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
