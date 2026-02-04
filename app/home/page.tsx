import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard (home is an alias for dashboard)
  redirect("/dashboard")
}
