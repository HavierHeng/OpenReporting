"use client"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Upload } from "lucide-react"

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
    default: ""
    
  - name: company_name
    type: static
    label: Company Name
    help: The name of your company
    default: ""
    
  - name: report_date
    type: datetime
    format: YYYY-MM-DD
    label: Report Date
    default: ""
    
  - name: financial_summary
    type: dynamic
    label: Financial Summary
    prompt: Please provide details about your financial situation.
    
  - name: market_analysis
    type: dynamic
    label: Market Analysis
    prompt: Let's discuss the current market conditions that affect your business.`)

  const [variables, setVariables] = useState([
    {
      name: "user_name",
      occurrences: 3,
      type: "static",
      label: "Your Name",
      help: "Your full name as it will appear on the report",
      default: "",
    },
    {
      name: "company_name",
      occurrences: 5,
      type: "static",
      label: "Company Name",
      help: "The name of your company",
      default: "",
    },
    {
      name: "report_date",
      occurrences: 1,
      type: "datetime",
      label: "Report Date",
      help: "Date of the report (YYYY-MM-DD)",
      default: "",
    },
    {
      name: "financial_summary",
      occurrences: 1,
      type: "dynamic",
      label: "Financial Summary",
      help: "Financial details",
      prompt: "Please provide details about your financial situation.",
    },
    {
      name: "market_analysis",
      occurrences: 1,
      type: "dynamic",
      label: "Market Analysis",
      help: "Market conditions",
      prompt: "Let's discuss the current market conditions that affect your business.",
    },
  ])

  const [docxFile, setDocxFile] = useState<File | null>(null)

  // Update YAML when variables change
  useEffect(() => {
    const newYaml = generateYamlFromVariables(variables)
    setYamlContent(newYaml)
  }, [variables])

  // Generate YAML from variables
  const generateYamlFromVariables = (vars: any[]) => {
    let yaml = `# OpenReporting Configuration
name: Sample Config
version: 1.0
template: sample.docx

variables:
`

    vars.forEach((variable) => {
      yaml += `  - name: ${variable.name}
    type: ${variable.type}
    label: ${variable.label}
`

      if (variable.help) {
        yaml += `    help: ${variable.help}
`
      }

      if (variable.type === "static" || variable.type === "datetime") {
        yaml += `    default: "${variable.default || ""}"
`
      }

      if (variable.type === "dynamic" && variable.prompt) {
        yaml += `    prompt: ${variable.prompt}
`
      }

      if (variable.type === "datetime" && variable.format) {
        yaml += `    format: ${variable.format || "YYYY-MM-DD"}
`
      }

      yaml += `    
`
    })

    return yaml.trim()
  }

  // Update variable
  const updateVariable = (index: number, field: string, value: any) => {
    setVariables((prev) => {
      const newVariables = [...prev]
      newVariables[index] = { ...newVariables[index], [field]: value }
      return newVariables
    })
  }

  const handleSave = () => {
    toast({
      title: "Configuration saved",
      description: "Your YAML configuration has been saved successfully.",
    })
  }

  const handleExport = () => {
    // Create a blob with the YAML content
    const blob = new Blob([yamlContent], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = "openreporting-config.yaml"
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Configuration exported",
      description: "Your YAML configuration has been exported as a file.",
    })
  }

  const handleValidate = () => {
    try {
      // In a real app, you would validate the YAML here
      toast({
        title: "YAML validated",
        description: "Your YAML configuration is valid.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Validation error",
        description: "Your YAML configuration contains errors.",
        variant: "destructive",
      })
    }
  }

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
                <div className="relative">
                  <Textarea
                    className="font-mono h-[500px] resize-y min-h-[300px] overflow-auto"
                    value={yamlContent}
                    onChange={(e) => setYamlContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleValidate} variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validate
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleExport}>
                    Export
                  </Button>
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
                        <th className="text-left py-3 px-4">Label</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Default</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variables.map((variable, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">
                            <Input
                              value={variable.name}
                              onChange={(e) => updateVariable(index, "name", e.target.value)}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              value={variable.label}
                              onChange={(e) => updateVariable(index, "label", e.target.value)}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="p-2 border rounded bg-background w-full"
                              value={variable.type}
                              onChange={(e) => updateVariable(index, "type", e.target.value)}
                            >
                              <option value="static">Static</option>
                              <option value="dynamic">Dynamic</option>
                              <option value="datetime">Date/Time</option>
                              <option value="summary">Summary</option>
                              <option value="table">Table</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {(variable.type === "static" || variable.type === "datetime") && (
                              <Input
                                value={variable.default || ""}
                                onChange={(e) => updateVariable(index, "default", e.target.value)}
                                className="w-full"
                                placeholder="Default value"
                              />
                            )}
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
                  <div className="space-x-2">
                    <Button onClick={handleValidate} variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Validate
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={handleExport}>
                      Export
                    </Button>
                  </div>
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
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center max-w-md mx-auto">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Drag and drop your DOCX file here, or click to browse
                    </p>
                    <div className="flex justify-center">
                      <Button onClick={() => document.getElementById("docx-upload")?.click()} className="bg-primary">
                        Upload DOCX
                      </Button>
                    </div>
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
                  <div className="border rounded-lg p-4 max-w-md mx-auto">
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
