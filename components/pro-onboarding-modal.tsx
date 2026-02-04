"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Briefcase, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const PROFESSIONAL_ROLES = [
  "Therapist",
  "Counselor",
  "Psychologist",
  "Psychiatrist",
  "Social Worker",
  "Nurse",
  "Life Coach",
  "Other",
]

export function ProOnboardingModal({ isOpen, onClose, onComplete }: ProOnboardingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [role, setRole] = useState("")
  const [license, setLicense] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pro/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, hasLicense: !!license }),
      })

      if (!response.ok) throw new Error("Failed to create professional account")

      setStep("success")
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error("[v0] Pro onboarding error:", error)
      alert("Failed to create professional account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicense(e.target.files[0])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            {step === "form" ? (
              <Card className="border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-soft-cyan/10">
                        <Briefcase className="w-6 h-6 text-soft-cyan" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">Welcome to Serenity Pro</CardTitle>
                        <CardDescription className="text-soft-text">Set up your professional account</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-soft-text hover:text-white">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-white">
                        Professional Role
                      </Label>
                      <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger
                          id="role"
                          className="bg-deep-purple/50 border-soft-cyan/20 text-white focus:border-soft-cyan"
                        >
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-purple border-soft-cyan/20">
                          {PROFESSIONAL_ROLES.map((r) => (
                            <SelectItem key={r} value={r} className="text-white hover:bg-soft-cyan/10">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* License Upload (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-white">
                        License/Certification (Optional)
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="license"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("license")?.click()}
                          className="w-full border-soft-cyan/20 text-soft-text hover:text-white hover:border-soft-cyan"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {license ? license.name : "Upload License"}
                        </Button>
                      </div>
                      <p className="text-xs text-soft-text">
                        Upload your professional license for verification (PDF, JPG, PNG)
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!role || isSubmitting}
                      className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating Account..." : "Create Serenity Pro Account"}
                    </Button>

                    <p className="text-xs text-center text-soft-text">
                      Start with the Free tier (1 patient, 10-day history)
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
                <CardContent className="pt-12 pb-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle className="w-20 h-20 mx-auto text-soft-cyan mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome to Serenity Pro!</h3>
                  <p className="text-soft-text">Redirecting to your professional dashboard...</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
