import { redirect } from "next/navigation"

export default function ProDashboardPage() {
  // Redirect to pro page (dashboard is an alias for pro)
  redirect("/pro")
}
