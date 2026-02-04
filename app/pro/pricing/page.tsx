import { Check, Crown, Building2, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ProPricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30 mb-4">Professional Plans</Badge>
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-soft-text max-w-2xl mx-auto">
            Scale your practice with the right tools for your client base
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Free Plan Card */}
          <Card className="border-gray-700 bg-deep-purple/80 backdrop-blur-xl hover:border-gray-600 transition-all relative">
            <div className="absolute top-0 right-0 bg-gray-700 text-gray-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
              FREE
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-2xl text-white">Serenity Free</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-soft-text">/forever</span>
              </div>
              <CardDescription className="text-soft-text mt-2">Perfect for testing the waters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="w-5 h-5 text-primary" />
                  <span>1 client only</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="w-5 h-5 text-primary" />
                  <span>10-day history</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="w-5 h-5 text-primary" />
                  <span>No AI summaries</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="w-5 h-5 text-cyan-300" />
                  <span>No exports</span>
                </div>
                <div className="flex items-center gap-2 text-soft-cyan">
                  <Check className="w-5 h-5" />
                  <span>Invite 1 client</span>
                </div>
                <div className="flex items-center gap-2 text-soft-cyan">
                  <Check className="w-5 h-5" />
                  <span>Basic mood view</span>
                </div>
              </div>

              <div className="text-xs font-medium text-orange-300 text-center">
                <p className="text-xs font-medium text-center">
                  Not built for long-term use. Upgrade to unlock your practice.
                </p>
              </div>

              <Link href="/pro/dashboard" className="block">
                <Button
                  variant="outline"
                  className="w-full border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                >
                  Continue with Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Serenity Pro */}
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl hover:border-soft-cyan/40 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-2xl text-white">Serenity Pro</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-soft-text">/month</span>
              </div>
              <CardDescription className="text-soft-text mt-2">Perfect for individual practitioners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span className="font-semibold">10 clients</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Full history access</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Mood timelines & trends</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>AI chat summaries</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Data exports</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Trend alerts</span>
                </div>
              </div>
              <Link href="/pro/upgrade?tier=pro" className="block">
                <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Serenity Scope - Popular */}
          <Card className="border-soft-cyan bg-deep-purple/90 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-soft-cyan to-soft-blue text-white px-4 py-1 text-sm font-semibold">
              Popular
            </div>
            <CardHeader className="pt-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-2xl text-white">Serenity Scope</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-soft-text">/month</span>
              </div>
              <CardDescription className="text-soft-text mt-2">For growing practices and clinics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span className="font-semibold">40 clients</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>All Pro features</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Custom alerts</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Branded reports</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>API access</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Audit logs</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Priority support</span>
                </div>
              </div>
              <Link href="/pro/upgrade?tier=scope" className="block">
                <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Serenity Institute */}
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl hover:border-soft-cyan/40 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-2xl text-white">Serenity Institute</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <CardDescription className="text-soft-text mt-2">
                For schools, hospitals & large organizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span className="font-semibold">100–1000+ clients</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>All Scope features</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>SSO integration</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>HIPAA compliance logs</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Custom onboarding</span>
                </div>
                <div className="flex items-center gap-2 text-soft-text">
                  <Check className="w-5 h-5 text-soft-cyan" />
                  <span>Priority 24/7 support</span>
                </div>
              </div>
              <Link href="/pro/pricing/request-quote" className="block">
                <Button className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow">
                  Request Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-soft-text">
            All plans include secure data storage, HIPAA-compliant infrastructure, and regular updates
          </p>
          <p className="text-sm text-soft-text">
            Need help choosing?{" "}
            <Link href="/contact" className="text-soft-cyan hover:underline">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
