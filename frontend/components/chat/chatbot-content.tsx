"use client"

import { useState } from "react"
import { ConfigSelection } from "./config-selection"
import { ChatInterface } from "./chat-interface"
import { useReportContext } from "@/components/providers/report-provider"
import { DocumentPreview } from "./document-preview"
import { YamlViewer } from "./yaml-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ChatbotContent() {
  const { configSelected, currentSection } = useReportContext()
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat")
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Show preview tab when we reach the summary or complete section
  const showPreviewTab = currentSection === "executive_summary" || currentSection === "complete"

  return (
    <div className="space-y-6">
      {!configSelected && <ConfigSelection />}

      {configSelected && (
        <div className="relative">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "chat" | "preview")}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                {showPreviewTab && <TabsTrigger value="preview">Document Preview</TabsTrigger>}
              </TabsList>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
            <TabsContent value="chat" className="mt-0">
              <ChatInterface />
            </TabsContent>
            {showPreviewTab && (
              <TabsContent value="preview" className="mt-0">
                <DocumentPreview />
              </TabsContent>
            )}
          </Tabs>

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>YAML Configuration</DialogTitle>
              </DialogHeader>
              <YamlViewer configId="1" />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
