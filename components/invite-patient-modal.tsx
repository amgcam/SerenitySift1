"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, LinkIcon, Copy, Check, Send, AlertCircle, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import type { ProTier } from "@/lib/pro-tiers"

interface InvitePatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  canInvite: boolean
  upgradeMessage: string
  currentTier: ProTier
}

export function InvitePatientModal({
  isOpen,
  onClose,
  onSuccess,
  canInvite,
  upgradeMessage,
  currentTier,
}: InvitePatientModalProps) {
  const [step, setStep] = useState<"form" | "success" | "limit">("form")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientName, setPatientName] = useState("")
  const [message, setMessage] = useState("Share your mood journey with me?")
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canInvite) {
      setStep("limit")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pro/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientEmail, patientName, message }),
      })

      if (response.status === 403) {
        const data = await response.json()
        if (data.error?.includes("limit")) {
          setStep("limit")
          return
        }
      }

      if (!response.ok) throw new Error("Failed to send invite")

      const data = await response.json()
      setInviteLink(data.inviteLink)
      setStep("success")
    } catch (error) {
      console.error("[v0] Invite error:", error)
      alert("Failed to send invite. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setStep("form")
    setPatientEmail("")
    setPatientName("")
    setMessage("Share your mood journey with me?")
    setInviteLink("")
    setCopied(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            {step === "limit" ? (
              <Card className="border-coral/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-white">Client Limit Reached</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="text-soft-text hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-coral" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-white font-medium">{upgradeMessage}</p>
                    <p className="text-soft-text text-sm">
                      Upgrade your plan to invite more clients and unlock additional features.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={currentTier === "scope" ? "/pro/pricing/request-quote" : "/pro/pricing"}
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        {currentTier === "scope" ? "Request Institute Quote" : "View Upgrade Options"}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="w-full border-soft-cyan/20 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : step === "form" ? (
              <Card className="border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-soft-cyan/10">
                        <Mail className="w-6 h-6 text-soft-cyan" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">Invite Patient</CardTitle>
                        <CardDescription className="text-soft-text">Send a secure invitation link</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="text-soft-text hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName" className="text-white">
                        Patient Name
                      </Label>
                      <Input
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientEmail" className="text-white">
                        Patient Email
                      </Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="patient@example.com"
                        required
                        className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">
                        Personal Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        rows={3}
                        className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Invitation"}
                      </Button>
                    </div>

                    <p className="text-xs text-center text-soft-text">Invite link expires in 7 days</p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-soft-cyan/20 bg-deep-purple/95 backdrop-blur-xl shadow-soft-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-white">Invitation Sent!</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="text-soft-text hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <Check className="w-16 h-16 text-soft-cyan" />
                  </motion.div>

                  <p className="text-center text-soft-text">
                    An invitation has been sent to <span className="text-white font-medium">{patientEmail}</span>
                  </p>

                  <div className="space-y-2">
                    <Label className="text-white">Share Link Directly</Label>
                    <div className="flex gap-2">
                      <Input value={inviteLink} readOnly className="bg-deep-purple/50 border-soft-cyan/20 text-white" />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-soft-cyan/20 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-soft-cyan/10 border border-soft-cyan/20 rounded-lg p-4">
                    <p className="text-sm text-soft-text">
                      <LinkIcon className="w-4 h-4 inline mr-1" />
                      They have <span className="text-white font-medium">7 days</span> to accept this invitation
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      onSuccess()
                      handleClose()
                    }}
                    className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90"
                  >
                    Done
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
