"use client"

import type React from "react"

import { ReportProvider } from "@/components/providers/report-provider"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { HistoryDialog } from "./dialogs/history-dialog"
import { SettingsDialog } from "./dialogs/settings-dialog"
import { ConfigSelection } from "./chat/config-selection"
import { ChatInterface } from "./chat/chat-interface"
import { usePathname } from "next/navigation"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const pathname = usePathname()

  // Check if we're on the chatbot page
  const isChatbotPage = pathname === "/chatbot"

  return (
    <ReportProvider>
      <div className="flex min-h-screen flex-col">
        <MainNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1">
          <Sidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            onHistoryClick={() => setHistoryOpen(true)}
            onSettingsClick={() => setSettingsOpen(true)}
          />

          <main className="flex-1 overflow-y-auto">
            {/* Render chatbot interface if on chatbot page */}
            {isChatbotPage ? (
              <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Start a New Report</h1>
                <ChatbotContent />
              </div>
            ) : (
              children
            )}
          </main>
        </div>

        <MobileNav onHistoryClick={() => setHistoryOpen(true)} />
      </div>

      <HistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </ReportProvider>
  )
}

// Separate component for chatbot content to ensure context is available
function ChatbotContent() {
  const { configSelected } = useReportContext()

  return (
    <>
      {!configSelected && <ConfigSelection />}
      <ChatInterface />
    </>
  )
}

// Import at the end to avoid circular dependencies
import { useReportContext } from "@/components/providers/report-provider"
