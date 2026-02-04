export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  type: "subscription" | "theme"
  images?: string[]
}

// Product catalog for Stripe checkout
export const PRODUCTS: Product[] = [
  {
    id: "premium-monthly",
    name: "SerenitySift Premium (Monthly)",
    description: "Unlock in-depth AI feedback, unlimited custom emotions, exportable data, and ad-free experience",
    priceInCents: 499, // $4.99/month
    type: "subscription",
  },
  {
    id: "premium-yearly",
    name: "SerenitySift Premium (Yearly)",
    description:
      "Unlock in-depth AI feedback, unlimited custom emotions, exportable data, and ad-free experience. Save 17%!",
    priceInCents: 4999, // $49.99/year
    type: "subscription",
  },
  {
    id: "themes-pack",
    name: "Themes Pack",
    description: "Unlock additional themes: Cyberpunk, Light Mode, and Nature",
    priceInCents: 199, // $1.99 one-time
    type: "theme",
  },
  {
    id: "work-stress-analyzer",
    name: "Work Stress Analyzer",
    description: "Track and analyze work-related stress patterns with AI-powered insights",
    priceInCents: 299, // $2.99 one-time
    type: "theme",
  },
  {
    id: "relationship-tracker",
    name: "Relationship Mood Tracker",
    description: "Monitor emotional patterns in your relationships with detailed analytics",
    priceInCents: 299, // $2.99 one-time
    type: "theme",
  },
  {
    id: "export-credits",
    name: "Export Credits (5 Pack)",
    description: "Purchase 5 PDF/CSV export credits for your mood data",
    priceInCents: 199, // $1.99 one-time
    type: "theme",
  },
]

export const THEMES = [
  { id: "default", name: "Default Gradient", free: true },
  { id: "cyberpunk", name: "Cyberpunk Neon", free: false },
  { id: "light", name: "Light Mode", free: false },
  { id: "nature", name: "Nature Calm", free: false },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]
