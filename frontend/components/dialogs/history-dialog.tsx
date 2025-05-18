"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getReportHistory, downloadReport } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface HistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryDialog({ open, onOpenChange }: HistoryDialogProps) {
  const [reports, setReports] = useState<{ id: string; name: string; date: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  // Load reports when dialog opens
  useEffect(() => {
    if (open) {
      loadReports()
    }
  }, [open])

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await getReportHistory()
      setReports(data)
    } catch (error) {
      console.error("Error loading report history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (reportId: string) => {
    setDownloading(reportId)
    try {
      const blob = await downloadReport(reportId)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Report_${reportId}.docx`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading report:", error)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No reports found</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-2 border-b">
                <span>{report.name}</span>
                <Button onClick={() => handleDownload(report.id)} disabled={downloading === report.id}>
                  {downloading === report.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    "Download"
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
