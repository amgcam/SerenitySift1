import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-[#00D4FF] mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Effective Date: November 3, 2025</p>

          <div className="prose prose-invert prose-cyan max-w-none space-y-6 text-gray-200">
            <p>
              At <strong className="text-white">Serenity Sift</strong>, your privacy is paramount. This Privacy Policy
              explains how we collect, use, store, and protect your personal information when you use our Services.
            </p>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Account Information</strong>: Email, password (encrypted), display name,
                account type, professional role (if applicable)
              </li>
              <li>
                <strong className="text-white">Mood Data</strong>: Mood scores, notes, timestamps, emotion tags
              </li>
              <li>
                <strong className="text-white">AI Interactions</strong>: Chat messages with Serenity Spark (stored with
                consent)
              </li>
              <li>
                <strong className="text-white">Usage Data</strong>: Device type, browser, IP address, session duration
              </li>
              <li>
                <strong className="text-white">Payment Information</strong>: Processed securely via Stripe (we do not
                store card details)
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and improve the Services</li>
              <li>Generate personalized insights and trends</li>
              <li>Train AI models (anonymized data only)</li>
              <li>Process payments and subscriptions</li>
              <li>Send notifications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">3. Data Sharing</h2>
            <p>We do not sell your data. We may share information with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Professional Users</strong>: Only with explicit client consent via
                checkbox modal
              </li>
              <li>
                <strong className="text-white">Service Providers</strong>: Stripe (payments), hosting providers
                (encrypted storage)
              </li>
              <li>
                <strong className="text-white">Legal Authorities</strong>: When required by law or to protect safety
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your data (export as PDF/CSV)</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data (30-day retention for backups)</li>
              <li>Revoke consent for data sharing</li>
              <li>Opt out of notifications</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">6. Professional Mode Privacy</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Client data is shared only with explicit consent</li>
              <li>Professionals cannot edit or delete client logs</li>
              <li>Clients can revoke access at any time</li>
              <li>HIPAA-compliant practices for Institute tier</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#00D4FF] mt-8 mb-4">7. Contact Us</h2>
            <p>
              For privacy questions or data requests, contact us at:{" "}
              <strong className="text-white">privacy@serenitysift.com</strong>
            </p>

            <p className="text-sm text-gray-400 mt-8 pt-8 border-t border-gray-700">Last Updated: November 3, 2025</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
