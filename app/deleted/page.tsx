import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DeletedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0A3D] via-[#1a0525] to-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-[#2A0A3D]/80 border-[#00D4FF]/20 backdrop-blur-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-[#00D4FF]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Deleted</h1>
        <p className="text-gray-300 mb-6">
          Your account has been scheduled for deletion. All your data will be permanently removed after 30 days.
        </p>
        <p className="text-sm text-gray-400 mb-6">If you change your mind, you can create a new account anytime.</p>
        <Link href="/">
          <Button className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-white">Return to Home</Button>
        </Link>
      </Card>
    </div>
  )
}
