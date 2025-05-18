"use client"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function ConfigPage() {
  const [yamlContent, setYamlContent] = useState(`# OpenReporting Configuration
name: Sample Config
version: 1.0
template: sample.docx

variables:
  - name: user_name
    type: static
    label: Your Name
    help: Your full name as it will appear on the report
    
  - name: company_name
    type: static
    label: Company Name
    help: The name of your company
    
  - name: report_date
    type: datetime
    format: YYYY-MM-DD
    label: Report Date
    
  - name: financial_summary
    type: dynamic
    label: Financial Summary
    prompt: Please provide details about your financial situation.
    
  - name: market_analysis
    type: dynamic
    label: Market Analysis
    prompt: Let's discuss the current market conditions that affect your business.`)

  const variables = [
    { name: "user_name", occurrences: 3, type: "static" },
    { name: "company_name", occurrences: 5, type: "static" },
    { name: "report_date", occurrences: 1, type: "datetime" },
    { name: "financial_summary", occurrences: 1, type: "dynamic" },
    { name: "market_analysis", occurrences: 1, type: "dynamic" },
  ]

  const [docxFile, setDocxFile] = useState<File | null>(null)

  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">YAML Config Editor</h1>

        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">YAML Editor</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>YAML Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="font-mono h-[500px]"
                  value={yamlContent}
                  onChange={(e) => setYamlContent(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button>Save</Button>
                  <Button variant="outline">Export</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variables">
            <Card>
              <CardHeader>
                <CardTitle>Template Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Variable</th>
                        <th className="text-left py-3 px-4">Occurrences</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variables.map((variable, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{variable.name}</td>
                          <td className="py-3 px-4">{variable.occurrences}</td>
                          <td className="py-3 px-4">
                            <select className="p-2 border rounded bg-background" defaultValue={variable.type}>
                              <option value="static">Static</option>
                              <option value="dynamic">Dynamic</option>
                              <option value="datetime">Date/Time</option>
                              <option value="summary">Summary</option>
                              <option value="table">Table</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="link" size="sm">
                              Configure
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4">
                  <Button>Update Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle>Upload DOCX Template</CardTitle>
              </CardHeader>
              <CardContent>
                {!docxFile ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your DOCX file here, or click to browse
                    </p>
                    <Button onClick={() => document.getElementById("docx-upload")?.click()}>Upload DOCX</Button>
                    <input
                      id="docx-upload"
                      type="file"
                      accept=".docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setDocxFile(e.target.files[0])
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{docxFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(docxFile.size / 1024)} KB - Uploaded {new Date().toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDocxFile(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
