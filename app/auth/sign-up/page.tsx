"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type AccountType = "personal" | "professional"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>("personal")
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const displayName = formData.get("displayName") as string

    if (accountType === "professional") {
      setError("Professional Mode is currently coming soon and invite-only. Please create a Personal account for now.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    if (!supabase) {
      setError("Unable to connect to authentication service. Please try again later.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            display_name: displayName,
            account_type: "personal",
            professional_role: null,
          },
        },
      })

      if (signUpError) {
        const friendlyError = signUpError.message.includes("already registered")
          ? "This email is already registered. Try signing in instead."
          : signUpError.message

        setError(friendlyError)
        setIsLoading(false)
        return
      }

      if (data.user) {
        setSuccess(true)

        if (data.session) {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      console.error("[v0] Sign-up error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-deep-purple via-darker-purple to-black">
        <div className="w-full max-w-md">
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl shadow-soft-glow">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-soft-cyan/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-soft-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-soft-cyan">Check Your Email</CardTitle>
              <CardDescription className="text-soft-text text-center">
                We've sent a confirmation link to your email address. Please click the link to verify your account and
                complete sign-up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-soft-cyan/10 border border-soft-cyan/30 p-4">
                <p className="text-sm text-soft-text text-center">
                  After confirming your email, you'll be automatically signed in and redirected to your dashboard.
                </p>
              </div>
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-deep-purple via-darker-purple to-black">
      <div className="w-full max-w-sm">
        <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl shadow-soft-glow">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Image src="/logo.png" alt="SerenitySift Logo" width={80} height={80} className="rounded-2xl" />
            </div>

            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
              Join SerenitySift
            </CardTitle>

            <CardDescription className="text-soft-text text-center">
              Start your emotional wellness journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-soft-text text-center">Account Type</Label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountType("personal")
                        setError(null)
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all ${
                        accountType === "personal"
                          ? "bg-soft-cyan text-white shadow-soft-glow"
                          : "bg-darker-purple/50 text-soft-text hover:bg-darker-purple"
                      }`}
                      aria-label="Account type: Personal"
                    >
                      Personal
                    </button>

                    <button
                      type="button"
                      disabled
                      className="flex-1 py-2.5 px-4 rounded-full font-medium transition-all bg-darker-purple/30 text-soft-text/50 cursor-not-allowed border border-soft-cyan/10"
                      aria-label="Professional Mode is coming soon and currently invite-only"
                      title="Professional Mode is coming soon and currently invite-only."
                    >
                      Professional
                      <span className="ml-1 text-xs text-soft-cyan">Soon</span>
                    </button>
                  </div>

                  <p className="rounded-lg border border-soft-cyan/20 bg-soft-cyan/10 p-3 text-xs leading-relaxed text-soft-text">
                    Professional Mode is currently coming soon and invite-only. Please create a Personal account for now.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayName" className="text-soft-text">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Your name"
                    required
                    className="border-soft-cyan/30 bg-darker-purple text-white placeholder:text-soft-text/50 focus:border-soft-cyan"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-soft-text">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="border-soft-cyan/30 bg-darker-purple text-white placeholder:text-soft-text/50 focus:border-soft-cyan"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-soft-text">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="border-soft-cyan/30 bg-darker-purple text-white placeholder:text-soft-text/50 focus:border-soft-cyan"
                  />
                  <p className="text-xs text-soft-text/70">Must be at least 6 characters</p>
                </div>

                {error && (
                  <div className="rounded-lg bg-soft-coral/10 border border-soft-coral/30 p-3">
                    <p className="text-sm text-soft-coral">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <div className="flex items-start gap-3 mt-4">
                  <input type="checkbox" id="terms" required className="mt-1 accent-soft-cyan w-4 h-4" />
                  <label htmlFor="terms" className="text-sm text-soft-text leading-tight">
                    I agree to the{" "}
                    <a
                      href="/legal/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-soft-cyan hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="text-soft-cyan hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-soft-text">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-soft-cyan hover:underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}