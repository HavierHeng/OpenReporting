"use client"

import { useRef, useEffect, useState } from "react"
import { useReportContext } from "@/components/providers/report-provider"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { StaticFieldsForm } from "@/components/chat/static-fields-form"
import { SectionDivider } from "@/components/chat/section-divider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function ChatInterface() {
  const { messages, configSelected, staticFieldsSubmitted, currentSection, sendMessage, isLoading } = useReportContext()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up scroll detection
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isLoading) return
    sendMessage(message)
  }

  // Function to render section dividers based on message content
  const renderMessageWithDividers = (message: any, index: number) => {
    // Special handling for section transition messages
    if (message.content === "Static Fields Submitted") {
      return <SectionDivider key={message.id}>Static Fields Submitted</SectionDivider>
    }

    if (message.content === "Finances Completed") {
      return <SectionDivider key={message.id}>Finances Completed</SectionDivider>
    }

    if (message.content === "Market_analysis Completed") {
      return <SectionDivider key={message.id}>Market Analysis Completed</SectionDivider>
    }

    // Regular message
    return <ChatMessage key={message.id} message={message} />
  }

  return (
    <Card className="mt-6">
      <div ref={chatContainerRef} className="h-[calc(100vh-250px)] overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {messages.length > 0 && <ChatMessage message={messages[0]} />}

        {/* Show static fields form after config selection */}
        {configSelected && !staticFieldsSubmitted && (
          <>
            <SectionDivider>Static Fields</SectionDivider>
            <StaticFieldsForm />
          </>
        )}

        {/* Render all messages except the welcome message */}
        {messages.slice(1).map(renderMessageWithDividers)}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {showScrollButton && (
        <Button size="icon" className="absolute bottom-20 right-6 rounded-full shadow-md" onClick={scrollToBottom}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span className="sr-only">Scroll to bottom</span>
        </Button>
      )}
    </Card>
  )
}
