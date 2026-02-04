import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Brain, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-deep-purple via-darker-purple to-black p-6">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="SerenitySift Logo"
              width={180}
              height={180}
              className="rounded-3xl shadow-soft-glow"
            />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-warm-orange via-soft-coral via-soft-purple via-soft-blue to-soft-cyan bg-clip-text text-transparent tracking-tight">
            SerenitySift
          </h1>
          <p className="text-xl text-soft-text">Your AI-powered emotional wellness companion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-soft-cyan/20 bg-deep-purple/50 backdrop-blur">
            <Brain className="w-10 h-10 text-soft-cyan" />
            <h3 className="font-semibold text-white">Track Emotions</h3>
            <p className="text-sm text-soft-text text-center">Log your moods with intensity tracking</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-soft-coral/20 bg-deep-purple/50 backdrop-blur">
            <Sparkles className="w-10 h-10 text-soft-coral" />
            <h3 className="font-semibold text-white">AI Insights</h3>
            <p className="text-sm text-soft-text text-center">Get personalized wellness recommendations</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-soft-purple/20 bg-deep-purple/50 backdrop-blur">
            <TrendingUp className="w-10 h-10 text-soft-purple" />
            <h3 className="font-semibold text-white">Build Habits</h3>
            <p className="text-sm text-soft-text text-center">Complete challenges and track progress</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-soft-purple to-soft-coral text-white hover:opacity-90 font-semibold shadow-soft-glow min-h-[44px]"
          >
            <Link href="/demo">Preview Demo</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow min-h-[44px]"
          >
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent min-h-[44px]"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
