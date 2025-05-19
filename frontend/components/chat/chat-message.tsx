"use client"

import type { Message } from "@/components/providers/report-provider"
import { useReportContext } from "@/components/providers/report-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { continueToNextSection, isLoading, currentDynamicField } = useReportContext()
  const isUser = message.role === "user"

  // Check if this is a section divider
  if (message.isSectionDivider) {
    return (
      <div className="section-divider">
        <span className="section-divider-text">{message.content}</span>
      </div>
    )
  }

  // Check if this is a field header
  if (message.isFieldHeader) {
    return (
      <div className="field-header">
        <div className="field-header-banner">{message.content}</div>
      </div>
    )
  }

  // Check if this message contains a continue prompt or is the last message in a dynamic field conversation
  const showContinueButton =
    message.role === "assistant" &&
    (message.content.includes("continue to the next section") ||
      message.content.includes("review and download") ||
      message.content.includes("ready for download") ||
      (currentDynamicField && currentDynamicField.prompt !== message.content && !isUser))

  return (
    <div className={cn("chat-message-container", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("chat-message", isUser ? "chat-message-user" : "chat-message-bot")}>
        <div className="flex items-start">
          {!isUser && (
            <Avatar className="h-8 w-8 mr-2 bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </Avatar>
          )}
          <div className="flex-1">
            <div className="chat-bubble">
              {message.content}

              {/* Render continue button if needed */}
              {showContinueButton && (
                <div className="mt-3">
                  <Button onClick={continueToNextSection} disabled={isLoading} size="sm">
                    {isLoading ? "Processing..." : "Continue"}
                  </Button>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">{formatTime(message.timestamp)}</div>
          </div>
          {isUser && (
            <Avatar className="h-8 w-8 ml-2 bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </Avatar>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
