"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { createServerClient } from "@/lib/supabase/server"

function getFullUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // If baseUrl already has a protocol, use it as-is
  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return `${baseUrl}${path}`
  }

  // Otherwise, add https:// protocol
  return `https://${baseUrl}${path}`
}

export async function createCheckoutSession(productId: string) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "User not authenticated" }
    }

    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      return { error: `Product with id "${productId}" not found` }
    }

    // Determine if this is a subscription or one-time payment
    const isYearly = productId === "premium-yearly"
    const isSubscription = productId.includes("premium")

    // Create Checkout Session with redirect
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            ...(isSubscription && {
              recurring: {
                interval: isYearly ? "year" : "month",
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? "subscription" : "payment",
      customer_email: user.email,
      success_url: getFullUrl("/subscription?success=true"),
      cancel_url: getFullUrl("/subscription?canceled=true"),
      metadata: {
        userId: user.id,
        productId: product.id,
        productType: product.type,
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function startCheckoutSession(productId: string) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          ...(product.type === "subscription" && {
            recurring: {
              interval: "month",
            },
          }),
        },
        quantity: 1,
      },
    ],
    mode: product.type === "subscription" ? "subscription" : "payment",
    customer_email: user.email,
    metadata: {
      userId: user.id,
      productId: product.id,
      productType: product.type,
    },
  })

  return session.client_secret!
}

export async function updateSubscriptionStatus(userId: string, status: "free" | "premium", subscriptionId?: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_status: status,
      subscription_id: subscriptionId,
    })
    .eq("id", userId)

  if (error) {
    throw new Error("Failed to update subscription status")
  }
}

export async function unlockThemes(userId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      purchased_themes: ["default", "cyberpunk", "light", "nature"],
    })
    .eq("id", userId)

  if (error) {
    throw new Error("Failed to unlock themes")
  }
}
