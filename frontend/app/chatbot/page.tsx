"use client"

import { ChatbotContent } from "@/components/chat/chatbot-content"
import { AppShell } from "@/components/app-shell"

export default function ChatbotPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Start a New Report</h1>
        <ChatbotContent />
      </div>
    </AppShell>
  )
}
