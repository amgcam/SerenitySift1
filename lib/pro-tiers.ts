// Professional tier definitions and limits

export const PRO_TIERS = {
  free: {
    name: "Free",
    price: 0,
    maxPatients: 1,
    historyDays: 10,
    features: ["1 patient", "10-day history", "Basic mood view"],
  },
  pro: {
    name: "Serenity Pro",
    price: 49,
    annualPrice: 490,
    maxPatients: 10,
    historyDays: null, // unlimited
    features: ["10 clients", "Full history", "Mood timelines", "AI chat summaries", "Data exports", "Trend alerts"],
  },
  scope: {
    name: "Serenity Scope",
    price: 99,
    annualPrice: 990,
    maxPatients: 40,
    historyDays: null, // unlimited
    features: [
      "40 clients",
      "All Pro features",
      "Custom alerts",
      "Branded reports",
      "API access",
      "Audit logs",
      "Priority support",
    ],
  },
  institute: {
    name: "Serenity Institute",
    price: 299, // starting price
    annualPrice: 2990,
    maxPatients: 1000, // soft limit, can be increased
    historyDays: null,
    features: [
      "100–1000+ clients",
      "All Scope features",
      "SSO integration",
      "HIPAA compliance logs",
      "Dedicated account manager",
      "Custom onboarding",
      "Priority 24/7 support",
      "Custom integrations",
    ],
  },
} as const

export type ProTier = keyof typeof PRO_TIERS

export function canAddPatient(tier: ProTier, currentPatientCount: number): boolean {
  const tierConfig = PRO_TIERS[tier]
  if (tierConfig.maxPatients === null) return true
  return currentPatientCount < tierConfig.maxPatients
}

export function getHistoryLimit(tier: ProTier): number | null {
  return PRO_TIERS[tier].historyDays
}

export function getNextTier(tier: ProTier): ProTier | null {
  if (tier === "free") return "pro"
  if (tier === "pro") return "scope"
  if (tier === "scope") return "institute"
  return null
}

export function getUpgradeMessage(tier: ProTier, currentCount: number): string {
  const tierConfig = PRO_TIERS[tier]
  const nextTier = getNextTier(tier)

  if (!tierConfig.maxPatients || currentCount < tierConfig.maxPatients) {
    return ""
  }

  if (nextTier === "institute") {
    return "Contact us for Institute plan to add more clients"
  }

  if (nextTier) {
    const nextTierConfig = PRO_TIERS[nextTier]
    return `Upgrade to ${nextTierConfig.name} for ${nextTierConfig.maxPatients} clients`
  }

  return "Client limit reached"
}
