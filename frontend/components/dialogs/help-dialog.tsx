"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OpenReporting Help</DialogTitle>
          <DialogDescription>Learn how to use OpenReporting effectively.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="usage">
          <TabsList className="mb-4">
            <TabsTrigger value="usage">Basic Usage</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <h3 className="text-lg font-semibold">Getting Started</h3>

            <div className="space-y-2">
              <h4 className="font-medium">1. Start a New Report</h4>
              <p>Navigate to the Chatbot page and select a configuration template to begin.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Fill in Static Fields</h4>
              <p>
                Complete all the required static fields in the form. These are fields that don't require AI assistance.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Dynamic Field Conversations</h4>
              <p>
                After submitting static fields, the AI will guide you through conversations to gather information for
                dynamic fields.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">4. Review and Download</h4>
              <p>Once all fields are complete, review the document preview and download your report.</p>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration Guide</h3>

            <div className="space-y-2">
              <h4 className="font-medium">YAML Configuration</h4>
              <p>The YAML configuration defines the structure of your report, including:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>Static fields (filled via form)</li>
                <li>Dynamic fields (filled via AI conversation)</li>
                <li>Table fields (structured data)</li>
                <li>Summary fields (generated after all other fields)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">DOCX Templates</h4>
              <p>Create Word templates with variables that match your YAML configuration.</p>
              <p className="text-sm text-muted-foreground">
                Example: <code>&#123;&#123;client_name&#125;&#125;</code> will be replaced with the client name.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <h3 className="text-lg font-semibold">Deployment Options</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Docker Deployment</h4>
              <p>For self-hosted environments, including air-gapped networks:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">docker-compose up -d</pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Local Development</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">npm install npm run dev</pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Vercel Deployment</h4>
              <p>For cloud-based deployment with automatic updates.</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
