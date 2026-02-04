"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

/**
 * AuthProvider listens to authentication state changes and refreshes
 * the session when users sign in, sign out, or recover their password.
 * This ensures the middleware and server components have the latest session.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      return
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Refresh the page to update server-side session
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        router.refresh()
      }

      // Handle password recovery
      if (event === "PASSWORD_RECOVERY") {
        router.push("/auth/reset-password")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return <>{children}</>
}
