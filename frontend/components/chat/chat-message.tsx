"use client"

import type { Message } from "@/components/providers/report-provider"
import { useReportContext } from "@/components/providers/report-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { continueToNextSection, isLoading } = useReportContext()
  const isUser = message.role === "user"

  // Check if this message contains a continue prompt
  const showContinueButton =
    message.role === "assistant" &&
    (message.content.includes("continue to the next section") ||
      message.content.includes("review and download") ||
      message.content.includes("ready for download"))

  return (
    <div className={cn("chat-message", isUser ? "ml-auto" : "")}>
      <div className={cn("px-4 py-3 rounded-lg", isUser ? "chat-message-user" : "chat-message-bot")}>
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
      <div className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
