"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useChat } from "@ai-sdk/react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input: chatInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-soft-cyan" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-cyan via-soft-blue to-soft-purple bg-clip-text text-transparent">
              SerenitySpark
            </h1>
          </div>
          <p className="text-muted-foreground">Your AI wellness companion • Powered by Gemini</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-deep-purple/30 rounded-2xl border border-soft-cyan/20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-20 h-20 text-soft-cyan mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Hello, I'm SerenitySpark</h3>
              <p className="text-muted-foreground max-w-md">
                I'm here to listen, support your emotional wellness, and help you reflect.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-5 py-3.5",
                    message.role === "user"
                      ? "bg-gradient-to-r from-soft-cyan to-soft-blue text-white"
                      : "bg-zinc-800/80 border border-soft-cyan/30"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/80 border border-soft-cyan/30 rounded-2xl px-5 py-3.5 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-soft-cyan" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-zinc-900 border border-soft-cyan/30 rounded-xl px-5 py-3 focus:outline-none focus:border-soft-cyan"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-soft-cyan to-soft-blue px-6 rounded-xl disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}