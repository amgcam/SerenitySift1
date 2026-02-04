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
import { CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
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
              Reset Password
            </CardTitle>
            <CardDescription className="text-soft-text text-center">
              {success ? "Check your email" : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <p className="text-center text-soft-text">
                  We've sent a password reset link to <span className="text-soft-cyan font-semibold">{email}</span>
                </p>
                <p className="text-center text-sm text-soft-text/70">
                  Check your inbox and click the link to reset your password.
                </p>
                <Link href="/auth/login" className="mt-4 w-full">
                  <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow">
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className="text-sm text-soft-coral">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 font-semibold shadow-soft-glow"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                </form>
                <div className="mt-4 text-center text-sm text-soft-text">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-soft-cyan hover:underline underline-offset-4">
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
