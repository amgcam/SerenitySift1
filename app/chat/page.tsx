"use client"

import type React from "react"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      console.error("[v0] Chat error:", error)
      setError(error.message || "Unable to connect to AI chat. Please check your configuration or try again later.")
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setError(null)
    sendMessage({ text: input })
    setInput("")
  }

  const isLoading = status === "in_progress"

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-soft-cyan" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
              SerenitySpark
            </h1>
          </div>
          <p className="text-muted-foreground">Your AI wellness companion</p>
        </div>

        {error && (
          <Card className="mb-4 border-red-500/50 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-400 mb-1">AI Chat Unavailable</h3>
                <p className="text-sm text-red-300/90">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Messages Container */}
        <Card className="flex-1 border-soft-cyan/20 bg-deep-purple/50 backdrop-blur overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 max-w-md">
                  <Sparkles className="w-16 h-16 text-soft-cyan mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to SerenitySpark</h3>
                    <p className="text-muted-foreground">
                      I'm here to support your emotional wellness journey. Share what's on your mind, and let's talk
                      about it.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <Button
                      variant="outline"
                      className="border-soft-cyan/30 hover:bg-soft-cyan/10 bg-transparent"
                      onClick={() => setInput("I'm feeling anxious today")}
                    >
                      I'm feeling anxious today
                    </Button>
                    <Button
                      variant="outline"
                      className="border-soft-cyan/30 hover:bg-soft-cyan/10 bg-transparent"
                      onClick={() => setInput("Can you suggest some coping strategies?")}
                    >
                      Can you suggest some coping strategies?
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-3",
                        message.role === "user"
                          ? "bg-gradient-to-r from-soft-cyan to-soft-blue text-white"
                          : "bg-deep-purple/80 border border-soft-cyan/20 text-foreground",
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-soft-cyan" />
                          <span className="text-xs font-semibold text-soft-cyan">SerenitySpark</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.parts.map((part, index) => {
                          if (part.type === "text") {
                            return <span key={index}>{part.text}</span>
                          }
                          return null
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-deep-purple/80 border border-soft-cyan/20 rounded-lg px-4 py-3">
                      <Loader2 className="w-4 h-4 text-soft-cyan animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-soft-cyan/20 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                disabled={isLoading}
                className="flex-1 border-soft-cyan/30 bg-deep-purple/50 placeholder:text-muted-foreground/50 focus:border-soft-cyan"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-soft-cyan to-soft-blue hover:opacity-90 text-white shadow-soft-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
