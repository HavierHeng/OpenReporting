"use client"

import { useReportContext } from "@/components/providers/report-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileDown, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

export function DocumentPreview() {
  const { previewData, reportTitle } = useReportContext()
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // In a real app, this would call an API to generate the DOCX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success toast
      toast({
        title: "Report downloaded",
        description: `${reportTitle}.docx has been downloaded successfully.`,
      })
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md preview-container">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <FileDown size={18} />
            Document Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{reportTitle || "Untitled Report"}</h1>

            <div className="meta-info text-sm text-muted-foreground mb-6">
              <div>Client: {previewData.client_name || "[Client Name]"}</div>
              <div>Date: {previewData.report_date || "[Date]"}</div>
              <div>Email: {previewData.client_email || "[Email]"}</div>
            </div>

            <h2>Introduction</h2>
            <p>
              This report provides an analysis of [Client Name]'s business situation as of{" "}
              {previewData.report_date || "[Date]"}. It includes financial information, market analysis, and
              recommendations for future actions.
            </p>

            {/* Financial Information */}
            <h2>Financial Information</h2>
            {previewData.items_table ? (
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    {previewData.items_table.headers.map((header: string, i: number) => (
                      <th key={i} className="border border-border p-2 bg-muted/30">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.items_table.rows.map((row: string[], i: number) => (
                    <tr key={i}>
                      {row.map((cell: string, j: number) => (
                        <td key={j} className="border border-border p-2">
                          {cell || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>[No financial data available]</p>
            )}

            {/* Financial Description */}
            {previewData.finance_description && (
              <div className="mt-4">
                <p>{previewData.finance_description}</p>
              </div>
            )}

            {/* Market Analysis */}
            <h2>Market Analysis</h2>
            {previewData.market_analysis ? (
              <p>{previewData.market_analysis}</p>
            ) : (
              <p>[Market analysis not yet provided]</p>
            )}

            {/* Future Outlook */}
            <h2>Future Outlook</h2>
            {previewData.future_outlook ? (
              <p>{previewData.future_outlook}</p>
            ) : (
              <p>[Future outlook not yet provided]</p>
            )}

            {/* Executive Summary */}
            <h2>Executive Summary</h2>
            {previewData.executive_summary ? (
              <p>{previewData.executive_summary}</p>
            ) : (
              <p>[Executive summary will be generated when all sections are complete]</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 flex justify-end space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download DOCX
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
