"use client"

import { useState, useEffect } from "react"
import { useReportContext } from "@/components/providers/report-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getConfigs, getPreviousReport } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function ConfigSelection() {
  const { setConfigSelected, updateStaticField, tableData, setTableData } = useReportContext()
  const [showPrevious, setShowPrevious] = useState(false)
  const [configs, setConfigs] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingConfigs, setLoadingConfigs] = useState(true)

  // Load configs on mount
  useEffect(() => {
    async function loadConfigs() {
      try {
        const data = await getConfigs()
        setConfigs(data)
      } catch (error) {
        console.error("Error loading configs:", error)
      } finally {
        setLoadingConfigs(false)
      }
    }

    loadConfigs()
  }, [])

  const handleConfigSelect = (value: string) => {
    if (!value) return
    setConfigSelected(true)
  }

  const handlePreviousSelect = async (reportId: string) => {
    setLoading(true)
    try {
      // Load previous report data
      const data = await getPreviousReport(reportId)

      // Update static fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "items_table") {
          // Handle table data separately
          setTableData(value as any)
        } else {
          updateStaticField(key, value)
        }
      })

      // Set config as selected
      setConfigSelected(true)
    } catch (error) {
      console.error("Error loading previous report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6 animate-fade-in">
      <CardHeader>
        <CardTitle>Select Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {loadingConfigs ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select onValueChange={handleConfigSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a config..." />
                </SelectTrigger>
                <SelectContent>
                  {configs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowPrevious(!showPrevious)}
              className="w-full"
              disabled={loading}
            >
              {showPrevious ? "Hide Previous Reports" : "Copy Values from Previous Report"}
            </Button>

            {showPrevious && (
              <div className="space-y-2 pt-2 animate-slide-up">
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => handlePreviousSelect("1")} className="w-full">
                      Report_2025-05-01
                    </Button>
                    <Button variant="secondary" onClick={() => handlePreviousSelect("2")} className="w-full">
                      Report_2025-05-02
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
