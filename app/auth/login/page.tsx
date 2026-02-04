"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlError = searchParams.get("error")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      setError("Authentication service is not configured. Please contact support.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const friendlyError = error.message.includes("Invalid login")
          ? "Invalid email or password. Please check your credentials."
          : error.message.includes("Email not confirmed")
            ? "Please confirm your email address. Check your inbox for the confirmation link."
            : error.message
        setError(friendlyError)
      } else if (data.user) {
        const accountType = data.user.user_metadata?.account_type || "personal"
        const redirectTo = searchParams.get("redirectTo") || (accountType === "professional" ? "/pro" : "/dashboard")
        router.push(redirectTo)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-deep-purple via-darker-purple to-black">
      <div className="w-full max-w-sm">
        <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl shadow-soft-glow">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Image src="/logo.png" alt="SerenitySift Logo" width={150} height={150} className="rounded-2xl" />
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
              SerenitySift
            </CardTitle>
            <CardDescription className="text-soft-text text-center">
              Sign in to track your emotional journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-soft-cyan/30 bg-darker-purple text-white placeholder:text-soft-text/50 focus:border-soft-cyan"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-soft-text">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-soft-cyan hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-soft-cyan/30 bg-darker-purple text-white placeholder:text-soft-text/50 focus:border-soft-cyan"
                  />
                </div>
                {(error || urlError) && (
                  <div className="rounded-lg bg-soft-coral/10 border border-soft-coral/30 p-3">
                    <p className="text-sm text-soft-coral">{error || urlError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-soft-text">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-soft-cyan hover:underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
