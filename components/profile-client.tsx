"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserIcon, Bell, Palette, CreditCard, FileText, ChevronDown, ChevronUp, Shield, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth"

interface ProfileClientProps {
  user: User
  profile: any
}

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const router = useRouter()
  const [settingsExpanded, setSettingsExpanded] = useState(true)
  const [legalExpanded, setLegalExpanded] = useState(false)
  const [termsExpanded, setTermsExpanded] = useState(false)
  const [privacyExpanded, setPrivacyExpanded] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const accountType = user.user_metadata?.account_type || "personal"
  const role = user.user_metadata?.role || null
  const displayName = profile?.display_name || user.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isProfessional = accountType === "professional"
  const subscriptionTier = profile?.subscription_tier || "free"
  const proTier = profile?.pro_tier || "free"

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push("/auth/login")
  }

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        router.push("/deleted")
      } else {
        alert("Failed to delete account. Please try again.")
        setIsDeleting(false)
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-darker-purple pb-24 md:pb-8 md:pl-64">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-soft-text text-lg">Manage account, preferences, and legal agreements</p>
        </div>

        {/* User Info Card */}
        <Card className="bg-deep-purple border-soft-cyan/20 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soft-cyan to-soft-purple flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{displayName}</h2>
              <p className="text-soft-text">{user.email}</p>
            </div>
            {isProfessional && (
              <Link href="/pro">
                <Button className="bg-gradient-to-r from-soft-cyan to-soft-blue hover:shadow-soft-glow transition-all">
                  Go to Pro Dashboard
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Settings Section */}
          <div className="space-y-6">
            <Card className="bg-deep-purple border-soft-cyan/20 overflow-hidden">
              <button
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-soft-cyan/5 transition-colors"
              >
                <h2 className="text-2xl font-bold text-soft-cyan flex items-center gap-2">
                  <UserIcon className="w-6 h-6" />
                  Settings
                </h2>
                {settingsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-soft-cyan" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-soft-cyan" />
                )}
              </button>

              {settingsExpanded && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Account Type Badge */}
                  <div>
                    <label className="text-sm text-soft-text mb-2 block">Account Type</label>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-cyan/10 border border-soft-cyan/30">
                      <div className="w-2 h-2 rounded-full bg-soft-cyan animate-pulse" />
                      <span className="text-soft-cyan font-medium">
                        {isProfessional ? `Professional – ${role}` : "Personal"}
                      </span>
                    </div>
                  </div>

                  {/* Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-soft-cyan" />
                      <div>
                        <p className="text-white font-medium">Daily mood reminders</p>
                        <p className="text-sm text-soft-text">Customized to avoid repetition</p>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>

                  {/* Theme Selector */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Palette className="w-5 h-5 text-soft-cyan" />
                      <label className="text-white font-medium">Theme</label>
                    </div>
                    <select className="w-full px-4 py-2 rounded-lg bg-darker-purple border border-soft-cyan/30 text-white focus:outline-none focus:ring-2 focus:ring-soft-cyan">
                      <option>Cyberpunk (Current)</option>
                      <option disabled={subscriptionTier === "free"}>
                        Nature {subscriptionTier === "free" && "– Premium"}
                      </option>
                      <option disabled={subscriptionTier === "free"}>
                        Light {subscriptionTier === "free" && "– Premium"}
                      </option>
                    </select>
                  </div>

                  {/* Subscription Status */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-soft-cyan" />
                      <label className="text-white font-medium">Subscription</label>
                    </div>
                    {isProfessional ? (
                      <div className="space-y-2">
                        <div className="px-4 py-3 rounded-lg bg-darker-purple border border-soft-cyan/30">
                          <p className="text-white font-medium">
                            {proTier === "free" && "Free Tier"}
                            {proTier === "pro" && "Serenity Pro – $49/month"}
                            {proTier === "scope" && "Serenity Scope – $99/month"}
                          </p>
                          <p className="text-sm text-soft-text">
                            {proTier === "free" && "1 patient, 10-day history"}
                            {proTier === "pro" && "Up to 10 patients, full history"}
                            {proTier === "scope" && "Unlimited patients, API access"}
                          </p>
                        </div>
                        <Link href="/pro/upgrade">
                          <Button
                            variant="outline"
                            className="w-full border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                          >
                            {proTier === "free" ? "Upgrade Plan" : "Manage Subscription"}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="px-4 py-3 rounded-lg bg-darker-purple border border-soft-cyan/30">
                          <p className="text-white font-medium">
                            {subscriptionTier === "free" && "Free"}
                            {subscriptionTier === "premium" && "Premium – $4.99/month"}
                          </p>
                        </div>
                        <Link href="/subscription">
                          <Button
                            variant="outline"
                            className="w-full border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                          >
                            {subscriptionTier === "free" ? "Unlock Premium" : "Manage Subscription"}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <Button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-white font-medium flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <LogOut className="w-5 h-5" />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>

                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="text-xs text-gray-500 hover:text-gray-400 transition-colors underline"
                    >
                      Delete account
                    </button>
                  </div>
                  {/* </CHANGE> */}
                </div>
              )}
            </Card>
          </div>

          {/* Legal & Privacy Section - Terms of Service and Privacy Policy */}
          <div>
            <Card className="bg-deep-purple border-soft-cyan/20 overflow-hidden">
              <button
                onClick={() => setLegalExpanded(!legalExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-soft-cyan/5 transition-colors min-h-[44px]"
              >
                <h2 className="text-2xl font-bold text-soft-cyan flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Legal & Privacy
                </h2>
                {legalExpanded ? (
                  <ChevronUp className="w-5 h-5 text-soft-cyan" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-soft-cyan" />
                )}
              </button>

              {legalExpanded && (
                <div className="px-6 pb-6 space-y-4 max-h-[700px] overflow-y-auto hide-scrollbar ios-scroll">
                  {/* Terms of Service */}
                  <div className="border border-soft-cyan/20 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setTermsExpanded(!termsExpanded)}
                      className="w-full p-4 flex items-center justify-between hover:bg-soft-cyan/5 transition-colors bg-darker-purple min-h-[44px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-soft-cyan" />
                        <h3 className="text-lg font-bold text-white">Terms of Service</h3>
                      </div>
                      {termsExpanded ? (
                        <ChevronUp className="w-4 h-4 text-soft-cyan" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-soft-cyan" />
                      )}
                    </button>

                    {termsExpanded && (
                      <div className="p-6 bg-darker-purple/50 max-h-[500px] overflow-y-auto hide-scrollbar ios-scroll">
                        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-soft-text">
                          <p className="text-sm text-soft-text mb-4">Effective Date: November 3, 2025</p>

                          <p>
                            Welcome to <strong className="text-white">Serenity Sift</strong>, a Progressive Web App
                            (PWA) dedicated to supporting your emotional wellness journey through intuitive mood
                            tracking, personalized AI insights, and professional collaboration tools. These Terms of
                            Service ("Terms") govern your access to and use of the Serenity Sift app, website, and all
                            related services (collectively, the "Services"). By accessing or using the Services,
                            including creating an account, logging in, or submitting content, you agree to these Terms.
                            If you do not agree, please do not use the Services.
                          </p>

                          <p>
                            Serenity Sift is operated by [Your Company Name/Entity, e.g., Serenity Sift LLC], located at
                            [Your Address, e.g., 123 Serenity St., San Francisco, CA 94105, USA] ("we," "us," or "our").
                            We are committed to user privacy, ethical data use, and fostering a supportive environment.
                            These Terms form a binding legal agreement. We may update them periodically; continued use
                            after changes constitutes acceptance. The latest version is available in your Profile tab.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">
                            1. Eligibility and Account Creation
                          </h4>
                          <p>
                            You must be at least 13 years old (or the age of majority in your jurisdiction) and capable
                            of forming a binding contract to use the Services. By using the Services, you represent that
                            you meet these requirements and are not barred from using them under applicable law.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Account Types:</strong> During sign-up, select a Personal
                              Account for individual mood tracking or a Professional Account for mental health
                              professionals (e.g., therapists, counselors, nurses, social workers). Personal accounts
                              access core features; Professional accounts unlock Pro Mode for client monitoring.
                              Professionals must self-certify their role and may upload licenses for verification
                              (optional but recommended for trust).
                            </li>
                            <li>
                              <strong className="text-white">Account Responsibilities:</strong> You are solely
                              responsible for maintaining the confidentiality of your credentials and all activities
                              under your account. Notify us immediately of any unauthorized access at
                              support@serenitysift.com. We reserve the right to suspend or terminate accounts for
                              violations, including misuse of Pro Mode.
                            </li>
                            <li>
                              <strong className="text-white">Accuracy:</strong> Provide accurate information during
                              registration (e.g., display name, email). Professionals must represent qualifications
                              honestly; false claims may result in immediate suspension.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">2. Description of Services</h4>
                          <p>
                            Serenity Sift provides tools for self-reflection and professional support, accessible via
                            web or installed PWA on iOS/Android devices.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Personal Features:</strong> Quick mood logging (emotions on
                              1-10 scale with notes), streak tracking (animated fire icon), recent moods list with
                              progress bars, emotion distribution pie charts (multi-color sections), weekly/monthly
                              trends, and customizable themes (e.g., Cyberpunk, Nature—unlocked in Premium).
                            </li>
                            <li>
                              <strong className="text-white">AI Chatbot (Serenity Spark):</strong> Interact with AI for
                              tailored feedback on moods (e.g., "Take a deep breath" for anxiety). Responses are
                              generated securely and stored with consent.
                            </li>
                            <li>
                              <strong className="text-white">Notifications:</strong> Optional daily reminders for
                              logging (30 varied messages to prevent repetition, customizable timing/opt-out).
                            </li>
                            <li>
                              <strong className="text-white">Premium Subscription:</strong> $4.99/month (or $41.58/year,
                              17% discount) includes unlimited custom emotions, ad-free experience, in-depth AI
                              insights, predictive mood analysis, and unlimited PDF/CSV exports.
                            </li>
                            <li>
                              <strong className="text-white">Professional Mode (Pro):</strong> For qualified
                              professionals only. Includes secure client invites (7-day expiry links), consent-based
                              sharing (moods/notes/AI chats), read-only dashboards with timelines, streak alerts, note
                              highlights, and exports. Tiers:
                              <ul className="list-circle pl-6 mt-2 space-y-1">
                                <li>Free: 1 client, 10-day history.</li>
                                <li>Serenity Pro: $49/month (or $490/year) – Up to 10 clients, full history.</li>
                                <li>
                                  Serenity Scope: $99/month (or $990/year) – Up to 40 clients, team roles, bulk invites.
                                </li>
                                <li>
                                  Serenity Institute: Custom pricing (starting $299/month) – 100+ clients, SSO
                                  integration, HIPAA compliance logs, priority support for schools/hospitals.
                                </li>
                              </ul>
                            </li>
                            <li>
                              <strong className="text-white">Integrations:</strong> Offline caching for logging, Stripe
                              for payments, optional SSO (Google/Microsoft) for Institute Plan.
                            </li>
                          </ul>
                          <p>
                            Services are provided "as is." We may modify, suspend, or discontinue features at our
                            discretion, with notice where feasible.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">3. User Conduct and Content</h4>
                          <p>Use the Services responsibly and lawfully.</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Prohibited Conduct:</strong> Do not harass users, share
                              harmful content, reverse-engineer the app, use bots for scraping, or violate third-party
                              rights. In Pro Mode, professionals must obtain explicit consent for data sharing and
                              comply with ethical standards (e.g., no editing client data).
                            </li>
                            <li>
                              <strong className="text-white">User Content:</strong> Your moods, notes, AI chats, and
                              uploads ("User Content") remain yours but are non-confidential unless marked private. You
                              grant us a worldwide, royalty-free, perpetual license to use, store, and analyze User
                              Content to operate/improve Services (e.g., anonymized AI training). In Pro Mode, shared
                              client data is read-only; you are responsible for legal compliance (e.g., HIPAA).
                            </li>
                            <li>
                              <strong className="text-white">Pro Mode Specifics:</strong> Clients must consent via modal
                              (checkboxes for moods/notes/AI). Data sharing is revocable anytime. Professionals cannot
                              access non-consented data; misuse (e.g., unauthorized sharing) violates Terms and may
                              trigger reporting to authorities.
                            </li>
                          </ul>
                          <p>We may monitor for safety but respect privacy—see our Privacy Policy.</p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">4. Subscriptions and Payments</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Billing:</strong> Premium and Pro subscriptions auto-renew
                              via Stripe. Prices as listed; taxes extra. Free trials (if offered) auto-convert.
                            </li>
                            <li>
                              <strong className="text-white">Cancellation:</strong> Cancel anytime in Profile {">"}{" "}
                              Subscriptions. No refunds for partial periods; access ends at cycle close.
                            </li>
                            <li>
                              <strong className="text-white">Free Limits:</strong> Personal: Basic logging, limited
                              exports. Pro Free: 1 client, 10-day view. Scope: 40-client cap enforced via dashboard
                              counters.
                            </li>
                            <li>
                              <strong className="text-white">Institute Plan:</strong> Custom quotes via form; includes
                              SSO and HIPAA logs. No auto-billing until agreement.
                            </li>
                            <li>
                              <strong className="text-white">Changes:</strong> Prices may adjust with 30 days' notice;
                              continued use accepts.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">5. Intellectual Property</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Our Rights:</strong> The App's design (cyberpunk-calm
                              theme, charts, animations), AI models, and code are our property (copyright/trademarks).
                              You receive a limited, non-exclusive license for permitted use.
                            </li>
                            <li>
                              <strong className="text-white">Your Rights:</strong> User Content is yours; we claim no
                              ownership but require the license in Section 3.
                            </li>
                            <li>
                              <strong className="text-white">Feedback:</strong> Suggestions become our property
                              (royalty-free) for improvements.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">6. Disclaimers and Limitations</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">No Medical Advice:</strong> Serenity Sift aids reflection,
                              not diagnosis/treatment. AI insights are general; consult professionals for health
                              concerns. Pro Mode is supplementary—providers are liable for advice.
                            </li>
                            <li>
                              <strong className="text-white">Availability:</strong> Services are "as is." We disclaim
                              warranties for interruptions, errors, or data loss. Back up exports regularly.
                            </li>
                            <li>
                              <strong className="text-white">Pro Mode Disclaimer:</strong> Data sharing risks (e.g.,
                              consent revocation) are yours; we facilitate but don't insure relationships. Institute
                              Plan offers HIPAA tools, but compliance is your duty.
                            </li>
                            <li>
                              <strong className="text-white">Liability:</strong> Liability capped at fees paid in last
                              12 months. No consequential damages.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">7. Termination</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">By You:</strong> Delete account in Profile {">"} Settings
                              (data erased after 30 days).
                            </li>
                            <li>
                              <strong className="text-white">By Us:</strong> Suspend/terminate for violations (e.g.,
                              abuse, non-payment) with notice. Pro Mode violations lead to instant revocation.
                            </li>
                            <li>
                              <strong className="text-white">Effect:</strong> Access ends; anonymized data retained for
                              analytics.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">8. Governing Law and Disputes</h4>
                          <p>
                            Governed by California, USA laws. Disputes via binding arbitration in San Francisco or small
                            claims ({"<"}$10,000). No class actions.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">9. Changes to Terms</h4>
                          <p>
                            Updates posted in-app with notice. Major changes get 30 days' advance. Continued use =
                            acceptance.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">10. Contact</h4>
                          <p>
                            Email{" "}
                            <a href="mailto:support@serenitysift.com" className="text-soft-cyan hover:underline">
                              support@serenitysift.com
                            </a>{" "}
                            or use in-app feedback. Pro issues: Include role/client ID.
                          </p>

                          <p className="mt-6 text-white font-medium">
                            Thank you for choosing Serenity Sift—your calm in the digital storm.
                          </p>

                          <p className="text-sm text-soft-text mt-6 pt-4 border-t border-soft-cyan/20">
                            Last Updated: November 3, 2025
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Privacy Policy */}
                  <div className="border border-soft-cyan/20 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setPrivacyExpanded(!privacyExpanded)}
                      className="w-full p-4 flex items-center justify-between hover:bg-soft-cyan/5 transition-colors bg-darker-purple min-h-[44px]"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-soft-cyan" />
                        <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
                      </div>
                      {privacyExpanded ? (
                        <ChevronUp className="w-4 h-4 text-soft-cyan" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-soft-cyan" />
                      )}
                    </button>

                    {privacyExpanded && (
                      <div className="p-6 bg-darker-purple/50 max-h-[500px] overflow-y-auto hide-scrollbar ios-scroll">
                        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-soft-text">
                          <p className="text-sm text-soft-text mb-4">Effective Date: November 3, 2025</p>

                          <p>
                            At <strong className="text-white">Serenity Sift</strong>, your privacy is paramount. This
                            Privacy Policy explains how we collect, use, store, and protect your personal information
                            when you use our Services. By using Serenity Sift, you consent to the practices described
                            here.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">1. Information We Collect</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Account Data:</strong> Email address, display name, account
                              type (Personal/Professional), and optional professional credentials (role, license
                              uploads).
                            </li>
                            <li>
                              <strong className="text-white">Mood & Wellness Data:</strong> Mood logs (emotions, notes,
                              timestamps), streak data, AI chat transcripts (with consent), and custom emotions.
                            </li>
                            <li>
                              <strong className="text-white">Pro Mode Data:</strong> Client data shared with explicit
                              consent (moods, notes, anonymized AI summaries). Professionals cannot edit client data;
                              access is read-only.
                            </li>
                            <li>
                              <strong className="text-white">Device & Usage Data:</strong> IP address, browser type,
                              device info, app interactions (e.g., pages visited, features used), and offline cache
                              data.
                            </li>
                            <li>
                              <strong className="text-white">Payment Data:</strong> Processed via Stripe (we store only
                              subscription status, not card details).
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">2. How We Use Your Information</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Service Delivery:</strong> Provide mood tracking, AI
                              insights, Pro Mode dashboards, and notifications.
                            </li>
                            <li>
                              <strong className="text-white">AI Improvement:</strong> Anonymized mood data trains AI
                              models for better insights (no personal identifiers).
                            </li>
                            <li>
                              <strong className="text-white">Analytics:</strong> Aggregate usage trends to improve
                              features (e.g., most-used emotions, peak logging times).
                            </li>
                            <li>
                              <strong className="text-white">Communication:</strong> Send account updates, subscription
                              reminders, and optional mood logging prompts (opt-out anytime).
                            </li>
                            <li>
                              <strong className="text-white">Compliance:</strong> Meet legal obligations (e.g., HIPAA
                              for Institute Plan, data breach notifications).
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">3. Data Sharing & Disclosure</h4>
                          <p>We do not sell your data. We share only as follows:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Pro Mode:</strong> Client data shared with professionals
                              only with explicit consent. Revocable anytime.
                            </li>
                            <li>
                              <strong className="text-white">Service Providers:</strong> Trusted partners (e.g., AWS for
                              hosting, Stripe for payments, AI providers for chatbot) under strict confidentiality
                              agreements.
                            </li>
                            <li>
                              <strong className="text-white">Legal Requirements:</strong> Disclose if required by law
                              (e.g., court orders, safety threats).
                            </li>
                            <li>
                              <strong className="text-white">Business Transfers:</strong> In mergers/acquisitions, data
                              transfers with notice and continued privacy protections.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">4. Data Storage & Security</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Encryption:</strong> Data encrypted in transit (TLS) and at
                              rest (AES-256).
                            </li>
                            <li>
                              <strong className="text-white">Location:</strong> Stored on AWS servers in US-East-1
                              (Virginia). Institute Plan offers regional options.
                            </li>
                            <li>
                              <strong className="text-white">Retention:</strong> Personal data deleted 30 days after
                              account closure. Anonymized analytics retained indefinitely.
                            </li>
                            <li>
                              <strong className="text-white">HIPAA Compliance:</strong> Institute Plan includes audit
                              logs, Business Associate Agreements (BAA), and enhanced security controls.
                            </li>
                            <li>
                              <strong className="text-white">Access Controls:</strong> Role-based permissions; only
                              authorized staff access data for support/debugging.
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">5. Your Rights</h4>
                          <p>You have the right to:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Access:</strong> View your data via Profile {">"} Data
                              Export.
                            </li>
                            <li>
                              <strong className="text-white">Correct:</strong> Update inaccurate info in Profile {">"}{" "}
                              Settings.
                            </li>
                            <li>
                              <strong className="text-white">Delete:</strong> Request deletion via Profile {">"} Delete
                              Account (30-day grace period).
                            </li>
                            <li>
                              <strong className="text-white">Export:</strong> Download moods/notes as PDF/CSV (Premium
                              unlimited; Free limited).
                            </li>
                            <li>
                              <strong className="text-white">Opt-Out:</strong> Disable notifications, revoke Pro Mode
                              consent, or close account anytime.
                            </li>
                            <li>
                              <strong className="text-white">Portability:</strong> Export data in machine-readable
                              formats (JSON/CSV).
                            </li>
                          </ul>
                          <p>
                            For requests, email{" "}
                            <a href="mailto:support@serenitysift.com" className="text-soft-cyan hover:underline">
                              support@serenitysift.com
                            </a>
                            .
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">6. Cookies & Tracking</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong className="text-white">Essential Cookies:</strong> Session management, login
                              persistence (cannot be disabled).
                            </li>
                            <li>
                              <strong className="text-white">Analytics:</strong> Anonymized usage tracking (e.g., page
                              views, feature clicks) via first-party tools. No third-party trackers.
                            </li>
                            <li>
                              <strong className="text-white">Offline Cache:</strong> PWA caches data locally for offline
                              access (cleared on logout).
                            </li>
                          </ul>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">7. Children's Privacy</h4>
                          <p>
                            Serenity Sift is for users 13+ (or age of majority). We do not knowingly collect data from
                            younger children. If we discover such data, we delete it immediately. Parents: Contact us if
                            concerned.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">8. International Users</h4>
                          <p>
                            Data processed in the USA. By using Serenity Sift, you consent to cross-border transfers.
                            Institute Plan offers EU/UK hosting for GDPR compliance.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">9. Changes to This Policy</h4>
                          <p>
                            We may update this Privacy Policy with notice (in-app or email). Major changes get 30 days'
                            advance notice. Continued use = acceptance. Check Profile {">"} Legal for the latest
                            version.
                          </p>

                          <h4 className="text-base font-bold text-white mt-6 mb-3">10. Contact Us</h4>
                          <p>
                            Questions about privacy? Email{" "}
                            <a href="mailto:support@serenitysift.com" className="text-soft-cyan hover:underline">
                              support@serenitysift.com
                            </a>{" "}
                            or write to:
                          </p>
                          <p className="pl-4">
                            Serenity Sift LLC
                            <br />
                            123 Serenity St.
                            <br />
                            San Francisco, CA 94105, USA
                          </p>

                          <p className="mt-6 text-white font-medium">
                            Your trust is our foundation. We're committed to protecting your data and supporting your
                            wellness journey with transparency and care.
                          </p>

                          <p className="text-sm text-soft-text mt-6 pt-4 border-t border-soft-cyan/20">
                            Last Updated: November 3, 2025
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-[#2A0A3D] border-red-900/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#FF6B6B]">Confirm Account Deletion</DialogTitle>
            <DialogDescription className="text-gray-300">
              This action is permanent and cannot be undone. All your data will be deleted after 30 days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">
                Type <strong className="text-white">DELETE</strong> to confirm:
              </p>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText("")
                }}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="flex-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
