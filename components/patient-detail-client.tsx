"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MessageSquare, FileText, Download, AlertTriangle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"

interface Mood {
  id: string
  emotion: string
  intensity: number
  note: string | null
  created_at: string
}

interface Chat {
  id: string
  role: string
  content: string
  created_at: string
}

interface PatientDetailClientProps {
  patientId: string
  patientName: string
  moods: Mood[]
  chats: Chat[]
  shareSettings: {
    shareMoods: boolean
    shareNotes: boolean
    shareChats: boolean
  }
}

export function PatientDetailClient({ patientId, patientName, moods, chats, shareSettings }: PatientDetailClientProps) {
  const [activeTab, setActiveTab] = useState("timeline")

  // Prepare timeline data
  const timelineData = moods
    .slice(0, 30)
    .reverse()
    .map((mood) => ({
      date: format(new Date(mood.created_at), "MMM dd"),
      intensity: mood.intensity,
      emotion: mood.emotion,
    }))

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

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/pro/export/${patientId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${patientName}-report.pdf`
      a.click()
    } catch (error) {
      console.error("[v0] Export error:", error)
      alert("Export feature coming soon!")
    }
  }

  const handleRevoke = async () => {
    if (!confirm(`Are you sure you want to disconnect ${patientName}? They will be notified.`)) return

    try {
      await fetch(`/api/pro/revoke/${patientId}`, { method: "POST" })
      window.location.href = "/pro"
    } catch (error) {
      console.error("[v0] Revoke error:", error)
      alert("Failed to revoke access. Please try again.")
    }
  }

  // Calculate stats
  const avgIntensity =
    moods.length > 0 ? (moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length).toFixed(1) : "0"
  const mostCommon =
    moods.length > 0
      ? Object.entries(
          moods.reduce(
            (acc, m) => {
              acc[m.emotion] = (acc[m.emotion] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A"

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Link href="/pro">
            <Button variant="ghost" className="text-soft-text hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-soft-cyan/20 flex items-center justify-center text-soft-cyan font-bold text-2xl">
                {patientName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{patientName}</h1>
                <p className="text-soft-text">Patient Overview</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-soft-cyan/20 text-soft-cyan hover:bg-soft-cyan/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={handleRevoke}
                variant="outline"
                className="border-coral/20 text-coral hover:bg-coral/10 bg-transparent"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Total Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-soft-cyan">{moods.length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Avg Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-soft-cyan">{avgIntensity}/10</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Most Common</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className="text-lg px-4 py-2"
                  style={{
                    backgroundColor: `${getMoodColor(mostCommon)}20`,
                    borderColor: getMoodColor(mostCommon),
                    color: getMoodColor(mostCommon),
                  }}
                >
                  {mostCommon}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4 bg-deep-purple/50">
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-soft-cyan/20 data-[state=active]:text-soft-cyan"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger
                    value="chats"
                    className="data-[state=active]:bg-soft-cyan/20 data-[state=active]:text-soft-cyan"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chats
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-soft-cyan/20 data-[state=active]:text-soft-cyan"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="insights"
                    className="data-[state=active]:bg-soft-cyan/20 data-[state=active]:text-soft-cyan"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Insights
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="timeline" className="space-y-6">
                  {shareSettings.shareMoods ? (
                    <>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                            <XAxis dataKey="date" stroke="#ffffff80" />
                            <YAxis domain={[0, 10]} stroke="#ffffff80" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#2A0A3D",
                                border: "1px solid #00D4FF40",
                                borderRadius: "8px",
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="intensity"
                              stroke="#00D4FF"
                              strokeWidth={2}
                              dot={{ fill: "#00D4FF" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-3">
                        {moods.slice(0, 10).map((mood) => (
                          <div
                            key={mood.id}
                            className="flex items-start gap-4 p-4 rounded-lg bg-deep-purple/50 border border-soft-cyan/10"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  style={{
                                    backgroundColor: `${getMoodColor(mood.emotion)}20`,
                                    borderColor: getMoodColor(mood.emotion),
                                    color: getMoodColor(mood.emotion),
                                  }}
                                >
                                  {mood.emotion} {mood.intensity}/10
                                </Badge>
                                <span className="text-sm text-soft-text">
                                  {format(new Date(mood.created_at), "MMM dd, yyyy 'at' h:mm a")}
                                </span>
                              </div>
                              {mood.note && <p className="text-soft-text text-sm mt-2">{mood.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-soft-text">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Patient has not shared mood data</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="chats">
                  {shareSettings.shareChats ? (
                    <div className="space-y-3">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 rounded-lg ${
                            chat.role === "user"
                              ? "bg-soft-cyan/10 border border-soft-cyan/20 ml-8"
                              : "bg-soft-purple/10 border border-soft-purple/20 mr-8"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                chat.role === "user"
                                  ? "bg-soft-cyan/20 text-soft-cyan"
                                  : "bg-soft-purple/20 text-soft-purple"
                              }
                            >
                              {chat.role === "user" ? "Patient" : "AI"}
                            </Badge>
                            <span className="text-xs text-soft-text">
                              {format(new Date(chat.created_at), "MMM dd, h:mm a")}
                            </span>
                          </div>
                          <p className="text-white">{chat.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-soft-text">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Patient has not shared chat data</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes">
                  {shareSettings.shareNotes ? (
                    <div className="space-y-3">
                      {moods
                        .filter((m) => m.note)
                        .map((mood) => (
                          <div key={mood.id} className="p-4 rounded-lg bg-deep-purple/50 border border-soft-cyan/10">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-soft-text">
                                {format(new Date(mood.created_at), "MMM dd, yyyy")}
                              </span>
                              <Badge
                                style={{
                                  backgroundColor: `${getMoodColor(mood.emotion)}20`,
                                  borderColor: getMoodColor(mood.emotion),
                                  color: getMoodColor(mood.emotion),
                                }}
                              >
                                {mood.emotion}
                              </Badge>
                            </div>
                            <p className="text-white">{mood.note}</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-soft-text">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Patient has not shared notes</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="insights">
                  <div className="space-y-4">
                    <Card className="border-soft-cyan/20 bg-deep-purple/50">
                      <CardHeader>
                        <CardTitle className="text-white">AI-Generated Insights</CardTitle>
                        <CardDescription className="text-soft-text">Coming soon</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-soft-text">
                          Advanced AI analysis of mood patterns, triggers, and recommendations will be available in a
                          future update.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
