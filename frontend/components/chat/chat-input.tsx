"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    onSendMessage(message)
    setMessage("")
  }

  const handleAttachment = () => {
    // In a real app, this would open a file picker
    const input = document.createElement("input")
    input.type = "file"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Handle the file upload
        console.log("File selected:", file.name)
      }
    }
    input.click()
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute left-2 h-8 w-8 text-muted-foreground"
        onClick={handleAttachment}
        disabled={disabled}
      >
        <Paperclip size={18} />
        <span className="sr-only">Attach file</span>
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="pl-12 pr-12 rounded-full"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 h-8 w-8 rounded-full"
        disabled={disabled || !message.trim()}
      >
        <Send size={16} />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  )
}
