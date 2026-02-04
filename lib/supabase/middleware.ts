import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  // Allow all requests if Supabase not configured (preview mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Refresh session - IMPORTANT: This is required
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public routes that don't require auth
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/callback",
    "/demo",
    "/legal",
  ]
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Protected routes that require auth
  const protectedRoutes = [
    "/dashboard",
    "/settings",
    "/subscription",
    "/log",
    "/history",
    "/insights",
    "/challenges",
    "/chat",
    "/dojo",
    "/concierge",
    "/profile",
  ]
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Redirect to login if accessing protected route without auth
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectTo", path)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (user && (path.startsWith("/auth/login") || path.startsWith("/auth/sign-up"))) {
    const accountType = user.user_metadata?.account_type || "personal"
    const url = request.nextUrl.clone()
    url.pathname = accountType === "professional" ? "/pro" : "/dashboard"
    return NextResponse.redirect(url)
  }

  // Handle account type routing
  if (user) {
    const accountType = user.user_metadata?.account_type || "personal"

    // Redirect professionals accessing personal routes
    if (accountType === "professional" && (path === "/" || path === "/dashboard")) {
      const url = request.nextUrl.clone()
      url.pathname = "/pro"
      return NextResponse.redirect(url)
    }

    // Redirect personal users accessing pro routes
    if (accountType !== "professional" && path.startsWith("/pro")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
