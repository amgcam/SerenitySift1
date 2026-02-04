"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User, FileText, Lock, LogOut, ChevronRight, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth"
import { ProBottomNav } from "./pro-bottom-nav"

interface ProProfileClientProps {
  user: {
    id: string
    email: string
    name: string
    role: string
    plan: string
    clientsUsed: number
    clientsLimit: number
  }
}

export function ProProfileClient({ user }: ProProfileClientProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push("/auth/login")
  }

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        router.push("/deleted")
      } else {
        alert("Failed to delete account. Please try again.")
        setIsDeleting(false)
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
      setIsDeleting(false)
    }
  }

  const getPlanDisplay = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "pro":
        return "Serenity Pro"
      case "scope":
        return "Serenity Scope"
      case "institute":
        return "Serenity Institute"
      default:
        return "Free"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0A3D] via-[#1a0525] to-black p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/pro")}
          className="flex items-center gap-2 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-[#00D4FF] mb-6">Professional Profile</h1>

        <Card className="mb-4 bg-[#2A0A3D]/80 border-[#00D4FF]/20 backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold text-[#00D4FF] mb-4">Professional Profile</h2>

          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                <User className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-[#00D4FF]">
                  {user.role} • {getPlanDisplay(user.plan)}
                </p>
              </div>
            </div>

            <hr className="border-gray-700" />

            {/* Plan & Clients */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Plan</p>
                <p className="font-medium text-[#00D4FF]">{getPlanDisplay(user.plan)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Clients</p>
                <p className="font-medium text-white">
                  {user.clientsUsed} / {user.clientsLimit}
                </p>
              </div>
            </div>

            <hr className="border-gray-700" />

            {/* Legal Links */}
            <button
              onClick={() => router.push("/legal/terms")}
              className="w-full text-left flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-colors min-h-[44px]"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00D4FF]" />
                <span className="text-white">Terms of Service</span>
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => router.push("/legal/privacy")}
              className="w-full text-left flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-800/50 transition-colors min-h-[44px]"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00D4FF]" />
                <span className="text-white">Privacy Policy</span>
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <hr className="border-gray-700" />

            {/* Sign Out */}
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-white rounded-lg font-medium transition-colors min-h-[44px]"
            >
              <LogOut className="w-5 h-5" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors underline"
              >
                Delete account
              </button>
            </div>
          </div>
        </Card>
      </div>

      <ProBottomNav />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-[#2A0A3D] border-red-900/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#FF6B6B]">Confirm Account Deletion</DialogTitle>
            <DialogDescription className="text-gray-300">
              This action is permanent and cannot be undone. All your professional data and client connections will be
              deleted after 30 days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">
                Type <strong className="text-white">DELETE</strong> to confirm:
              </p>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText("")
                }}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="flex-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
