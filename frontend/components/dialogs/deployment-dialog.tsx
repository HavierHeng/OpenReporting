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

interface DeploymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeploymentDialog({ open, onOpenChange }: DeploymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deployment Instructions</DialogTitle>
          <DialogDescription>Follow these instructions to deploy OpenReporting in your environment.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="docker">
          <TabsList className="mb-4">
            <TabsTrigger value="docker">Docker</TabsTrigger>
            <TabsTrigger value="local">Local Development</TabsTrigger>
            <TabsTrigger value="vercel">Vercel</TabsTrigger>
          </TabsList>

          <TabsContent value="docker" className="space-y-4">
            <h3 className="text-lg font-semibold">Docker Deployment</h3>

            <div className="space-y-2">
              <p>1. Clone the repository:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                git clone https://github.com/yourusername/openreporting.git cd openreporting
              </pre>
            </div>

            <div className="space-y-2">
              <p>2. Build and run with Docker Compose:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">docker-compose up -d</pre>
            </div>

            <div className="space-y-2">
              <p>3. Access the application:</p>
              <p>
                Open your browser and navigate to <code>http://localhost:3000</code>
              </p>
            </div>

            <div className="bg-primary/10 p-4 rounded-md">
              <h4 className="font-medium mb-2">Environment Variables</h4>
              <p className="text-sm">
                Configure the following environment variables in your <code>.env</code> file:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>OPENAI_API_KEY - Your OpenAI API key</li>
                <li>DATABASE_URL - SQLite database path (default: sqlite:///data/openreporting.db)</li>
                <li>JWT_SECRET - Secret for JWT token generation</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <h3 className="text-lg font-semibold">Local Development Setup</h3>

            <div className="space-y-2">
              <p>1. Clone the repository:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                git clone https://github.com/yourusername/openreporting.git cd openreporting
              </pre>
            </div>

            <div className="space-y-2">
              <p>2. Install dependencies:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">npm install</pre>
            </div>

            <div className="space-y-2">
              <p>3. Set up environment variables:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                cp .env.example .env # Edit .env with your configuration
              </pre>
            </div>

            <div className="space-y-2">
              <p>4. Run the development server:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">npm run dev</pre>
            </div>

            <div className="space-y-2">
              <p>5. Access the application:</p>
              <p>
                Open your browser and navigate to <code>http://localhost:3000</code>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="vercel" className="space-y-4">
            <h3 className="text-lg font-semibold">Vercel Deployment</h3>

            <div className="space-y-2">
              <p>1. Fork the repository on GitHub</p>
            </div>

            <div className="space-y-2">
              <p>2. Create a new project on Vercel and import your GitHub repository</p>
            </div>

            <div className="space-y-2">
              <p>3. Configure environment variables in the Vercel dashboard:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>OPENAI_API_KEY - Your OpenAI API key</li>
                <li>DATABASE_URL - Use a Postgres database URL (Vercel Postgres)</li>
                <li>JWT_SECRET - Secret for JWT token generation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p>4. Deploy the application</p>
              <p>Vercel will automatically build and deploy your application.</p>
            </div>

            <div className="bg-primary/10 p-4 rounded-md">
              <h4 className="font-medium mb-2">Note on Air-Gapped Environments</h4>
              <p className="text-sm">
                For air-gapped environments, you'll need to use the Docker deployment option and configure the
                application to use a local LLM provider like Ollama instead of OpenAI.
              </p>
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
