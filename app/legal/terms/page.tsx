import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0A3D] via-[#1a0525] to-black p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-[#00D4FF] hover:text-[#00D4FF]/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <Card className="bg-[#2A0A3D]/80 border-[#00D4FF]/20 backdrop-blur-xl p-8">
          <h1 className="text-3xl font-bold text-[#00D4FF] mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Effective Date: November 3, 2025</p>

          <div className="prose prose-invert prose-cyan max-w-none space-y-6 text-gray-200">
            <p>
              Welcome to <strong className="text-white">Serenity Sift</strong>, a Progressive Web App (PWA) designed to
              support your emotional wellness journey through intuitive mood tracking, personalized AI insights, and
              secure professional collaboration tools. These <strong className="text-white">Terms of Service</strong>{" "}
              ("Terms") govern your access to and use of the Serenity Sift app, website, and all related services
              (collectively, the "Services"). By accessing or using the Services — including creating an account,
              logging in, submitting content, or inviting clients — you agree to be bound by these Terms. If you do not
              agree, you may not use the Services.
            </p>

            <p>
              Serenity Sift is operated by <strong className="text-white">Serenity Sift LLC</strong>, located at{" "}
              <strong className="text-white">123 Serenity St., San Francisco, CA 94105, USA</strong> ("we," "us," or
              "our"). We are committed to user privacy, ethical data use, and fostering a safe, supportive environment.
              These Terms form a legally binding agreement between you and us. We may update them periodically;
              continued use after changes constitutes acceptance. The latest version is always available in your{" "}
              <strong className="text-white">Profile → Legal</strong> section.
            </p>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">1. Eligibility and Account Creation</h2>
            <p>
              You must be at least <strong className="text-white">13 years old</strong> (or the age of majority in your
              jurisdiction) and capable of forming a binding contract to use the Services. By using the Services, you
              represent and warrant that you meet these requirements and are not barred from using them under applicable
              law.
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Account Types</strong>:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>
                    <strong className="text-white">Personal Account</strong>: For individuals tracking their own mood
                    and wellness.
                  </li>
                  <li>
                    <strong className="text-white">Professional Account</strong>: For licensed mental health
                    professionals (e.g., therapists, counselors, nurses, social workers, psychiatrists) to monitor
                    consenting clients.
                  </li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Professional Verification</strong>: You must self-certify your
                professional role during sign-up. You may optionally upload a license or credential for verification.{" "}
                <strong className="text-white">
                  False representation of qualifications will result in immediate account suspension.
                </strong>
              </li>
              <li>
                <strong className="text-white">Account Security</strong>: You are solely responsible for maintaining the
                confidentiality of your login credentials and all activities under your account. Notify us immediately
                of any unauthorized access at <strong className="text-white">support@serenitysift.com</strong>.
              </li>
              <li>
                <strong className="text-white">Accuracy</strong>: All registration information must be accurate and
                current. We reserve the right to suspend or terminate accounts for providing false or misleading
                information.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">2. Description of Services</h2>
            <p>
              Serenity Sift provides self-reflection and professional wellness tools, accessible via web or installed
              PWA on iOS/Android devices.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Features</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Quick mood logging (1–10 scale with notes)</li>
              <li>Streak tracking (animated fire icon)</li>
              <li>Recent mood list with progress bars</li>
              <li>Emotion distribution pie charts (multi-color)</li>
              <li>Weekly/monthly trend graphs</li>
              <li>Customizable themes (e.g., Cyberpunk, Nature — unlocked in Premium)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">AI Chatbot: Serenity Spark</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Real-time, personalized feedback on logged moods (e.g., "Take a deep breath" for anxiety)</li>
              <li>Responses stored with user consent</li>
              <li>
                <strong className="text-white">Not medical advice</strong> — for reflection only
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Premium Subscription</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-white">$4.99/month</strong> or{" "}
                <strong className="text-white">$41.58/year</strong> (17% discount)
              </li>
              <li>
                Includes: unlimited custom emotions, ad-free, in-depth AI insights, predictive trends, unlimited PDF/CSV
                exports
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Professional Mode (Pro) — For Qualified Professionals Only
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Secure client invites (7-day expiry links)</li>
              <li>Consent-based data sharing (moods, notes, AI chats)</li>
              <li>
                Read-only client dashboards with:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Mood timelines</li>
                  <li>Streak alerts</li>
                  <li>Note highlights</li>
                  <li>PDF/CSV exports</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Tiers</strong>:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>
                    <strong className="text-white">Free</strong>: 1 client, 10-day history
                  </li>
                  <li>
                    <strong className="text-white">Serenity Pro</strong>: $49/month ($490/year) — Up to{" "}
                    <strong className="text-white">10 clients</strong>, full history
                  </li>
                  <li>
                    <strong className="text-white">Serenity Scope</strong>: $99/month ($990/year) — Up to{" "}
                    <strong className="text-white">40 clients</strong>, team roles, bulk invites
                  </li>
                  <li>
                    <strong className="text-white">Serenity Institute</strong>: Custom (from $299/month) — 100+ clients,
                    SSO, HIPAA audit logs, priority support
                  </li>
                </ul>
              </li>
            </ul>

            <p className="mt-4">
              Services are provided <strong className="text-white">"as is."</strong> We may modify, suspend, or
              discontinue features at our discretion, with reasonable notice where feasible.
            </p>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">3. User Conduct and Content</h2>
            <p>You agree to use the Services responsibly and lawfully.</p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Prohibited Conduct</h3>
            <p>You may not:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Harass, threaten, or harm other users</li>
              <li>Share harmful, illegal, or misleading content</li>
              <li>Reverse-engineer, scrape, or automate the app</li>
              <li>Violate third-party rights (copyright, privacy, etc.)</li>
              <li>Use Pro Mode without valid professional credentials</li>
              <li>Edit, delete, or falsify client data</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">User Content</h3>
            <p>
              Your mood logs, notes, AI chats, and uploads ("User Content") remain{" "}
              <strong className="text-white">your property</strong>, but are{" "}
              <strong className="text-white">non-confidential</strong> unless marked private. You grant us a{" "}
              <strong className="text-white">worldwide, royalty-free, perpetual license</strong> to use, store, and
              analyze User Content to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Operate and improve the Services</li>
              <li>Train AI models (anonymized)</li>
              <li>Generate insights and trends</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Pro Mode Specific Rules</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-white">Client consent is mandatory</strong> via checkbox modal
              </li>
              <li>
                Data sharing is <strong className="text-white">revocable at any time</strong>
              </li>
              <li>
                Professionals <strong className="text-white">cannot access non-consented data</strong>
              </li>
              <li>
                <strong className="text-white">Misuse</strong> (e.g., sharing without consent, unethical use) violates
                these Terms and may result in:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Account suspension</li>
                  <li>Reporting to licensing boards</li>
                  <li>Legal action</li>
                </ul>
              </li>
            </ul>

            <p className="text-sm text-gray-400 mt-8 pt-8 border-t border-gray-700">Last Updated: November 3, 2025</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
