"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Users, Crown, AlertCircle, TrendingUp, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvitePatientModal } from "./invite-patient-modal"
import { AnimatedFlame } from "./animated-flame"
import { PRO_TIERS, type ProTier, canAddPatient, getUpgradeMessage } from "@/lib/pro-tiers"
import Link from "next/link"
import { ProBottomNav } from "./pro-bottom-nav" // Added import for ProBottomNav

interface Patient {
  id: string
  name: string
  streak: number
  recentMoods: Array<{ emotion: string; intensity: number; created_at: string }>
  lastLog: string | null
}

interface ProDashboardClientProps {
  professionalName: string
  professionalRole: string
  proTier: ProTier
  patients: Patient[]
}

export function ProDashboardClient({ professionalName, professionalRole, proTier, patients }: ProDashboardClientProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)

  const tierConfig = PRO_TIERS[proTier]
  const patientCount = patients.length
  const maxPatients = tierConfig.maxPatients
  const canInvite = canAddPatient(proTier, patientCount)
  const upgradeMessage = getUpgradeMessage(proTier, patientCount)

  const getMoodColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "#00E676",
      sad: "#2196F3",
      anxious: "#FF5722",
      calm: "#9C27B0",
      angry: "#F44336",
      excited: "#FFD700",
    }
    return colors[emotion.toLowerCase()] || "#808080"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black pb-20">
      {" "}
      {/* Added pb-20 to prevent content from being hidden behind bottom nav */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Serenity Pro Dashboard</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30">{professionalRole}</Badge>
                <span className="text-soft-text">
                  <span className="text-white font-semibold">{patientCount}</span>
                  {maxPatients && (
                    <>
                      {" / "}
                      <span className="text-white font-semibold">{maxPatients}</span>
                    </>
                  )}
                  {" clients"}
                  {maxPatients && patientCount >= maxPatients && (
                    <span className="text-coral ml-2">(Limit reached)</span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!canInvite && upgradeMessage && (
                <Link href={proTier === "scope" ? "/pro/pricing/request-quote" : "/pro/pricing"}>
                  <Button
                    variant="outline"
                    className="border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    {proTier === "scope" ? "Contact for Institute" : "Upgrade Plan"}
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => setShowInviteModal(true)}
                disabled={!canInvite}
                className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canInvite ? upgradeMessage : "Invite a new client"}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Client
              </Button>
            </div>
          </div>
          {!canInvite && upgradeMessage && (
            <Card className="border-coral/20 bg-coral/10 backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-coral" />
                    <p className="text-white">{upgradeMessage}</p>
                  </div>
                  <Link href={proTier === "scope" ? "/pro/pricing/request-quote" : "/pro/pricing"}>
                    <Button className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
                      {proTier === "scope" ? "Request Quote" : "View Plans"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Tier Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-soft-cyan" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tierConfig.name}</h3>
                    <p className="text-sm text-soft-text">
                      {proTier === "free" ? "Upgrade for more features" : `$${tierConfig.price}/month`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {proTier !== "institute" && (
                    <Link href="/pro/pricing">
                      <Button
                        variant="outline"
                        className="border-soft-cyan/30 hover:bg-soft-cyan/10 bg-primary text-foreground"
                      >
                        View All Plans
                      </Button>
                    </Link>
                  )}
                  {proTier === "free" && (
                    <Link href="/pro/upgrade">
                      
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Grid */}
        {patients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
              <CardContent className="py-16 text-center">
                <Users className="w-16 h-16 mx-auto text-soft-cyan/50 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No Patients Yet</h3>
                <p className="text-soft-text mb-6">
                  Invite your first patient to begin monitoring their wellness journey
                </p>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90 shadow-soft-glow"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send First Invitation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/pro/patient/${patient.id}`}>
                  <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl hover:border-soft-cyan/40 transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-soft-cyan/20 flex items-center justify-center text-soft-cyan font-bold text-lg">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-white group-hover:text-soft-cyan transition-colors">
                              {patient.name}
                            </CardTitle>
                            <CardDescription className="text-soft-text text-sm">
                              {patient.lastLog
                                ? `Last log: ${new Date(patient.lastLog).toLocaleDateString()}`
                                : "No logs yet"}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Streak */}
                      <div className="flex items-center gap-2">
                        <AnimatedFlame />
                        <span className="text-white font-semibold">{patient.streak} day streak</span>
                      </div>

                      {/* Mood Sparkline */}
                      {patient.recentMoods.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-soft-text">
                            <TrendingUp className="w-4 h-4" />
                            <span>Recent moods</span>
                          </div>
                          <div className="flex gap-1 h-12 items-end">
                            {patient.recentMoods
                              .slice(0, 7)
                              .reverse()
                              .map((mood, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-t transition-all hover:opacity-80"
                                  style={{
                                    height: `${(mood.intensity / 10) * 100}%`,
                                    backgroundColor: getMoodColor(mood.emotion),
                                    minHeight: "8px",
                                  }}
                                  title={`${mood.emotion} (${mood.intensity}/10)`}
                                />
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Latest Mood */}
                      {patient.recentMoods[0] && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-soft-text">Latest:</span>
                          <Badge
                            className="border"
                            style={{
                              backgroundColor: `${getMoodColor(patient.recentMoods[0].emotion)}20`,
                              borderColor: getMoodColor(patient.recentMoods[0].emotion),
                              color: getMoodColor(patient.recentMoods[0].emotion),
                            }}
                          >
                            {patient.recentMoods[0].emotion} {patient.recentMoods[0].intensity}/10
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Alerts Section (if any) */}
        {patients.some((p) => p.recentMoods.some((m) => m.emotion === "anxious" && m.intensity >= 8)) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-coral/20 bg-coral/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-coral" />
                  <CardTitle className="text-white">Attention Needed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-soft-text">
                  Some patients are experiencing high anxiety levels. Consider reaching out for a check-in.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upgrade Nudge for Free Tier Users */}
        {proTier === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white p-4 rounded-full shadow-lg">
              <p className="text-sm font-medium text-center">
                Free plan limited to 1 client • Upgrade to Pro for 10 clients
              </p>
            </div>
          </motion.div>
        )}
      </div>
      <InvitePatientModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          window.location.reload()
        }}
        canInvite={canInvite}
        upgradeMessage={upgradeMessage}
        currentTier={proTier}
      />
      <ProBottomNav />
    </div>
  )
}
