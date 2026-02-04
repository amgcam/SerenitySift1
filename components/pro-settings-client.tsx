"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, FileText, CreditCard, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import type { ProTier } from "@/lib/pro-tiers"

interface Connection {
  id: string
  patient_id: string
  status: string
  share_moods: boolean
  share_notes: boolean
  share_chats: boolean
  connected_at: string
  profiles: { display_name: string } | null
}

interface AuditLog {
  id: string
  action: string
  share_moods: boolean | null
  share_notes: boolean | null
  share_chats: boolean | null
  created_at: string
  patient_connections: {
    profiles: { display_name: string } | null
  } | null
}

interface ProSettingsClientProps {
  professionalRole: string
  proTier: ProTier
  connections: Connection[]
  auditLogs: AuditLog[]
}

export function ProSettingsClient({ professionalRole, proTier, connections, auditLogs }: ProSettingsClientProps) {
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)

  const getActionIcon = (action: string) => {
    switch (action) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-soft-cyan" />
      case "updated":
        return <AlertCircle className="w-4 h-4 text-soft-blue" />
      case "revoked":
        return <XCircle className="w-4 h-4 text-coral" />
      default:
        return <Shield className="w-4 h-4 text-soft-text" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "accepted":
        return "bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30"
      case "updated":
        return "bg-soft-blue/20 text-soft-blue border-soft-blue/30"
      case "revoked":
        return "bg-coral/20 text-coral border-coral/30"
      default:
        return "bg-soft-text/20 text-soft-text border-soft-text/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/pro">
            <Button variant="ghost" className="text-soft-text hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Professional Settings</h1>
          <p className="text-soft-text">Manage your account, compliance, and billing</p>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
              <CardDescription className="text-soft-text">Your professional account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-soft-text mb-1">Role</p>
                  <Badge className="bg-soft-cyan/20 text-soft-cyan border-soft-cyan/30">{professionalRole}</Badge>
                </div>
                <div>
                  <p className="text-sm text-soft-text mb-1">Current Plan</p>
                  <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30">
                    {proTier === "free" ? "Free" : proTier === "pro" ? "Serenity Pro" : "Serenity Scope"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-soft-text mb-1">Active Patients</p>
                  <p className="text-white font-semibold">{connections.filter((c) => c.status === "active").length}</p>
                </div>
                <div>
                  <p className="text-sm text-soft-text mb-1">Total Connections</p>
                  <p className="text-white font-semibold">{connections.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Consent Audit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-white">Consent Audit Log</CardTitle>
              </div>
              <CardDescription className="text-soft-text">
                Complete history of patient consent changes for compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-soft-text">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No audit logs yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-deep-purple/50 border border-soft-cyan/10"
                    >
                      <div className="mt-1">{getActionIcon(log.action)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                          <span className="text-sm text-soft-text">
                            {log.patient_connections?.profiles?.display_name || "Unknown Patient"}
                          </span>
                          <span className="text-xs text-soft-text">
                            {format(new Date(log.created_at), "MMM dd, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        {log.action !== "revoked" && (
                          <div className="flex gap-2 text-xs">
                            {log.share_moods && (
                              <Badge variant="outline" className="border-soft-cyan/20 text-soft-cyan">
                                Moods
                              </Badge>
                            )}
                            {log.share_notes && (
                              <Badge variant="outline" className="border-soft-blue/20 text-soft-blue">
                                Notes
                              </Badge>
                            )}
                            {log.share_chats && (
                              <Badge variant="outline" className="border-soft-purple/20 text-soft-purple">
                                Chats
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Connections */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Active Patient Connections</CardTitle>
              <CardDescription className="text-soft-text">Manage data sharing permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {connections.filter((c) => c.status === "active").length === 0 ? (
                <div className="text-center py-8 text-soft-text">
                  <p>No active connections</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {connections
                    .filter((c) => c.status === "active")
                    .map((conn) => (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-deep-purple/50 border border-soft-cyan/10"
                      >
                        <div>
                          <p className="text-white font-medium">{conn.profiles?.display_name || "Unknown"}</p>
                          <p className="text-sm text-soft-text">
                            Connected {format(new Date(conn.connected_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {conn.share_moods && (
                            <Badge variant="outline" className="border-soft-cyan/20 text-soft-cyan">
                              Moods
                            </Badge>
                          )}
                          {conn.share_notes && (
                            <Badge variant="outline" className="border-soft-blue/20 text-soft-blue">
                              Notes
                            </Badge>
                          )}
                          {conn.share_chats && (
                            <Badge variant="outline" className="border-soft-purple/20 text-soft-purple">
                              Chats
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* HIPAA Compliance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-soft-purple/20 bg-soft-purple/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-soft-purple" />
                <CardTitle className="text-white">HIPAA Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-soft-text">
                Serenity Pro and Serenity Scope are designed with HIPAA compliance in mind. All patient data is
                encrypted at rest and in transit, and our consent audit system provides complete tracking of data
                sharing permissions.
              </p>
              <div className="bg-deep-purple/50 border border-soft-purple/20 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Business Associate Agreement (BAA)</h4>
                <p className="text-sm text-soft-text mb-4">
                  To ensure your practice meets all HIPAA requirements, we recommend signing a Business Associate
                  Agreement. Contact our compliance team to get started.
                </p>
                <Button className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
                  Request BAA
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Compliance Features:</h4>
                <ul className="space-y-2 text-sm text-soft-text">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                    <span>End-to-end encryption for all patient data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                    <span>Complete consent audit trail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                    <span>Patient-controlled data sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                    <span>Secure invite system with expiring links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-soft-cyan shrink-0 mt-0.5" />
                    <span>Instant revocation of access</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-soft-cyan" />
                <CardTitle className="text-white">Billing & Subscription</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {proTier === "free" ? "Free Plan" : proTier === "pro" ? "Serenity Pro" : "Serenity Scope"}
                  </p>
                  <p className="text-sm text-soft-text">
                    {proTier === "free" ? "Upgrade to unlock more features" : "Manage your subscription and billing"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {proTier === "free" ? (
                    <Link href="/pro/upgrade">
                      <Button className="bg-gradient-to-r from-soft-cyan to-soft-blue text-white hover:opacity-90">
                        Upgrade Plan
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/pro/upgrade">
                        <Button
                          variant="outline"
                          className="border-soft-cyan/20 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
                        >
                          Change Plan
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setShowDowngradeModal(true)}
                        variant="outline"
                        className="border-coral/20 text-coral hover:bg-coral/10 bg-transparent"
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
