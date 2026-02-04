export const NOTIFICATION_MESSAGES = [
  "Hey friend, how's your inner world today? Swing by Serenity Sift to log your mood!",
  "A quick check-in can brighten your day— what's your feeling right now?",
  "Pause and reflect: Tell us about your mood in Serenity Sift!",
  "Your daily vibe awaits! Log it now for better insights tomorrow.",
  "Feeling calm or energized? Share your mood with us—it's just a tap away!",
  "Take a breath and note your emotions. Serenity Sift is here for you.",
  "How's the day treating you? Let's capture that mood together.",
  "Unlock your streak—log today's mood and keep the serenity flowing!",
  "A moment for you: What's stirring in your heart today?",
  "Gentle nudge: Haven't heard from you yet—share your daily mood?",
  "Brighten your routine with a mood log. We're ready when you are!",
  "Curious about your day? Log your emotions and see the patterns emerge.",
  "Your serenity journey continues—add today's mood to the mix!",
  "Whisper from Serenity Sift: How are you feeling at this moment?",
  "Fuel your insights: Quick mood check-in time!",
  "Embrace the now—log your current vibe with ease.",
  "Haven't logged yet? Let's make today count in your mood journal.",
  "A friendly hello: Share how you're doing today!",
  "Tune into your emotions: Serenity Sift awaits your update.",
  "Small step, big clarity—log your mood and reflect.",
  "What's the emotional weather like today? Tell us!",
  "Keep the balance: Add your daily mood to Serenity Sift.",
  "Your thoughts matter—capture them with a quick log.",
  "Gentle reminder: How's your spirit holding up?",
  "Spark some self-care: Log today's mood for personalized tips.",
  "Unwind with us: Share your feelings from the day.",
  "Mood magic happens here—don't miss logging yours!",
  "A serene prompt: Reflect on your day with a mood entry.",
  "Ready to journal? Your daily mood spot is open.",
  "Nurture your well-being: Quick log to track your journey.",
] as const

export function getNextNotificationMessage(recentMessageIndices: number[]): {
  message: string
  index: number
} {
  // Filter out messages used in the last 10 notifications
  const availableIndices = Array.from({ length: NOTIFICATION_MESSAGES.length }, (_, i) => i).filter(
    (i) => !recentMessageIndices.slice(-10).includes(i),
  )

  // If all messages have been used recently, reset and use any message
  const indices =
    availableIndices.length > 0 ? availableIndices : Array.from({ length: NOTIFICATION_MESSAGES.length }, (_, i) => i)

  // Pick a random message from available ones
  const randomIndex = indices[Math.floor(Math.random() * indices.length)]

  return {
    message: NOTIFICATION_MESSAGES[randomIndex],
    index: randomIndex,
  }
}
