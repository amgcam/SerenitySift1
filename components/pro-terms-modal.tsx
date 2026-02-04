"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { acceptProTerms } from "@/app/actions/pro-terms"

interface ProTermsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function ProTermsModal({ isOpen, onClose, userId }: ProTermsModalProps) {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAgree = async () => {
    setIsLoading(true)
    try {
      await acceptProTerms(userId)
      router.push("/pro/dashboard")
    } catch (error) {
      console.error("Failed to accept terms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    // Redirect to account deletion or sign out
    router.push("/auth/login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#2A0A3D] border-[#00D4FF]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00D4FF]">Professional Account Agreement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-white">
          <p className="text-sm text-gray-300">By creating a Professional account, you agree to:</p>

          <ul className="text-sm space-y-3 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-[#00D4FF] mt-1">•</span>
              <span>
                Use client data only with <strong className="text-white">explicit consent</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00D4FF] mt-1">•</span>
              <span>
                Comply with <strong className="text-white">HIPAA</strong> and professional ethics
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00D4FF] mt-1">•</span>
              <span>Never edit or delete client logs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00D4FF] mt-1">•</span>
              <span>Maintain confidentiality and security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00D4FF] mt-1">•</span>
              <span>Accept full responsibility for data handling</span>
            </li>
          </ul>

          <label className="flex items-start gap-3 p-4 rounded-lg bg-[#1a0525] border border-[#00D4FF]/20 cursor-pointer hover:bg-[#1a0525]/80 transition-colors">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-[#00D4FF]/50 data-[state=checked]:bg-[#00D4FF] data-[state=checked]:border-[#00D4FF]"
            />
            <span className="text-sm text-gray-200">
              I have read and agree to the{" "}
              <a
                href="/legal/terms"
                target="_blank"
                className="text-[#00D4FF] underline hover:text-[#00D4FF]/80"
                rel="noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/legal/privacy"
                target="_blank"
                className="text-[#00D4FF] underline hover:text-[#00D4FF]/80"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          <div className="space-y-2 pt-4">
            <Button
              className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-white font-medium py-6 text-base"
              disabled={!agreed || isLoading}
              onClick={handleAgree}
            >
              {isLoading ? "Processing..." : "Agree & Continue to Dashboard"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-6 text-base bg-transparent"
              onClick={handleDecline}
              disabled={isLoading}
            >
              Decline (Cancel Account)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
