"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface YamlViewerProps {
  configId: string
}

export function YamlViewer({ configId }: YamlViewerProps) {
  const [copied, setCopied] = useState(false)

  // Sample YAML content based on the architecture document
  const yamlContent = `# OpenReporting Configuration
name: Financial Report
version: 1.0
template: financial_template.docx

variables:
  - name: client_name
    type: static
    label: Client Name
    help: Full name of the client
    
  - name: client_email
    type: static
    label: Email
    help: Client's email address
    
  - name: report_date
    type: datetime
    format: YYYY-MM-DD
    label: Report Date
    
  - name: items_table
    type: table
    label: Financial Items
    headers: ["Item", "Quantity", "Price"]
    
  - name: finance_description
    type: dynamic
    label: Financial Description
    prompt: Please provide details about the financial situation.
    
  - name: market_analysis
    type: dynamic
    label: Market Analysis
    prompt: Let's discuss the current market conditions that affect the business.
    
  - name: future_outlook
    type: dynamic
    label: Future Outlook
    prompt: Based on the financial data and market conditions, what is the outlook for the next period?
    
  - name: executive_summary
    type: summary
    label: Executive Summary
    prompt: Please review all the information and provide an executive summary.`

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>YAML Configuration</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {yamlContent}
        </pre>
      </CardContent>
    </Card>
  )
}
