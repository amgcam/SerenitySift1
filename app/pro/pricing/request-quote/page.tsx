"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function RequestQuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      organizationName: formData.get("organizationName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      organizationSize: formData.get("organizationSize"),
      useCase: formData.get("useCase"),
    }

    // TODO: Send to support@serenitysift.com via email service
    console.log("[v0] Institute quote request:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-soft-cyan/20 bg-deep-purple/90 backdrop-blur-xl">
            <CardContent className="py-16 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-soft-cyan/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-soft-cyan" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Request Received!</h2>
                <p className="text-soft-text max-w-md mx-auto">
                  Thank you for your interest in Serenity Institute. Our team will contact you within 1 business day to
                  discuss your needs and provide a custom quote.
                </p>
              </div>
              <Link href="/pro/pricing">
                <Button className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pricing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <Link href="/pro/pricing">
          <Button variant="ghost" className="text-soft-cyan hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/90 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-soft-cyan/10">
                  <Building2 className="w-6 h-6 text-soft-cyan" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-white">Request Institute Quote</CardTitle>
                  <CardDescription className="text-soft-text">
                    Tell us about your organization and we'll create a custom plan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-white">
                      Organization Name *
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      placeholder="Acme University"
                      required
                      className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-white">
                      Your Name *
                    </Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder="Jane Smith"
                      required
                      className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@acme.edu"
                      required
                      className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationSize" className="text-white">
                    Expected Number of Clients *
                  </Label>
                  <Select name="organizationSize" required>
                    <SelectTrigger className="bg-deep-purple/50 border-soft-cyan/20 text-white">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100-250">100-250 clients</SelectItem>
                      <SelectItem value="250-500">250-500 clients</SelectItem>
                      <SelectItem value="500-1000">500-1000 clients</SelectItem>
                      <SelectItem value="1000+">1000+ clients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase" className="text-white">
                    Tell us about your use case *
                  </Label>
                  <Textarea
                    id="useCase"
                    name="useCase"
                    placeholder="Describe your organization, how you plan to use Serenity Sift, and any specific requirements..."
                    rows={5}
                    required
                    className="bg-deep-purple/50 border-soft-cyan/20 text-white placeholder:text-soft-text focus:border-soft-cyan resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Request Quote"}
                  </Button>
                </div>

                <p className="text-xs text-center text-soft-text">
                  By submitting, you agree to be contacted by our sales team. We typically respond within 1 business
                  day.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
