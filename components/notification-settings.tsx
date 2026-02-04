"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NotificationPreferences {
  enabled: boolean
  time: string
  skipWeekends: boolean
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    time: "20:00",
    skipWeekends: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/notifications/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching notification preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      console.error("[v0] Error saving notification preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
        <CardContent className="p-6">
          <p className="text-soft-text/70 text-center">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-soft-cyan flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Daily Mood Reminders
        </CardTitle>
        <CardDescription className="text-soft-text/70">
          Get gentle reminders to log your mood and maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled" className="text-soft-text font-medium">
              Enable Reminders
            </Label>
            <p className="text-sm text-soft-text/70">Receive daily mood logging reminders</p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={preferences.enabled}
            onCheckedChange={(checked) => setPreferences({ ...preferences, enabled: checked })}
          />
        </div>

        {preferences.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="notification-time" className="text-soft-text font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reminder Time
              </Label>
              <input
                id="notification-time"
                type="time"
                value={preferences.time}
                onChange={(e) => setPreferences({ ...preferences, time: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-deep-purple/50 border border-soft-cyan/20 text-soft-text focus:outline-none focus:border-soft-cyan/50"
              />
              <p className="text-xs text-soft-text/70">Choose when you'd like to receive your daily reminder</p>
            </div>

            {/* Skip Weekends */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="skip-weekends" className="text-soft-text font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Skip Weekends
                </Label>
                <p className="text-sm text-soft-text/70">Don't send reminders on Saturdays and Sundays</p>
              </div>
              <Switch
                id="skip-weekends"
                checked={preferences.skipWeekends}
                onCheckedChange={(checked) => setPreferences({ ...preferences, skipWeekends: checked })}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-soft-cyan/10 border border-soft-cyan/20">
              <p className="text-sm text-soft-text/90">
                We'll send you a friendly reminder if you haven't logged your mood by your chosen time. Messages rotate
                through 30 different variations to keep things fresh!
              </p>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <Button
          onClick={savePreferences}
          disabled={saving}
          className="w-full bg-gradient-to-r from-soft-cyan to-soft-blue hover:opacity-90"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  )
}
