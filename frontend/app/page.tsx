import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to OpenReporting! Start by creating a new report with the Chatbot or editing a YAML configuration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Configs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">No recent configs.</p>
              <Button asChild>
                <Link href="/config">Create One</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">No recent reports.</p>
              <Button asChild>
                <Link href="/chatbot">Start a Chat</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
