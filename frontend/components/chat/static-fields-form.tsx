"use client"

import { useReportContext } from "@/components/providers/report-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export function StaticFieldsForm() {
  const {
    staticFields,
    updateStaticField,
    tableData,
    addTableRow,
    addTableColumn,
    removeTableRow,
    removeTableColumn,
    updateTableCell,
    updateTableHeader,
    submitStaticFields,
    isLoading,
    reportTitle,
    setReportTitle,
  } = useReportContext()

  return (
    <div className="bg-card border rounded-lg p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Static Fields</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report_title">Report Title</Label>
          <Input
            id="report_title"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Enter report title"
          />
          <p className="text-sm text-muted-foreground">Title of your report</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="client_name">Client Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                    <HelpCircle size={14} className="text-muted-foreground" />
                    <span className="sr-only">Client name help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Full name of the client</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="client_name"
            value={staticFields.client_name || ""}
            onChange={(e) => updateStaticField("client_name", e.target.value)}
            placeholder="Enter client name"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="report_date">Report Date</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                    <HelpCircle size={14} className="text-muted-foreground" />
                    <span className="sr-only">Report date help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Date of the report (YYYY-MM-DD)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="report_date"
            type="date"
            value={staticFields.report_date || "2025-05-19"}
            onChange={(e) => updateStaticField("report_date", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="client_email">Client Email</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                    <HelpCircle size={14} className="text-muted-foreground" />
                    <span className="sr-only">Client email help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Email address of the client</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="client_email"
            type="email"
            value={staticFields.client_email || ""}
            onChange={(e) => updateStaticField("client_email", e.target.value)}
            placeholder="Enter client email"
          />
        </div>

        {/* Render each table field */}
        {Object.entries(tableData).map(([tableId, table]) => (
          <div key={tableId} className="space-y-2">
            <div className="flex items-center">
              <Label>{tableId.charAt(0).toUpperCase() + tableId.slice(1).replace(/_/g, " ")}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <HelpCircle size={14} className="text-muted-foreground" />
                      <span className="sr-only">Table help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table data for {tableId.replace(/_/g, " ")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {table.headers.map((header, index) => (
                      <th key={index} className="p-3 border border-border text-left bg-muted/50 font-medium">
                        <Input
                          value={header}
                          onChange={(e) => updateTableHeader(tableId, index, e.target.value)}
                          placeholder="Column name"
                          className="border-0 bg-transparent"
                        />
                      </th>
                    ))}
                    <th className="w-10 p-3 border border-border bg-muted/50">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={() => addTableColumn(tableId)}
                      >
                        <Plus size={14} />
                        <span className="sr-only">Add column</span>
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-3 border border-border">
                          <Input
                            value={cell}
                            onChange={(e) => updateTableCell(tableId, rowIndex, cellIndex, e.target.value)}
                            placeholder="Enter value"
                            className="border-0 bg-transparent"
                          />
                        </td>
                      ))}
                      <td className="w-10 p-3 border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-muted-foreground"
                          onClick={() => removeTableRow(tableId, rowIndex)}
                          disabled={table.rows.length <= 1}
                        >
                          <X size={14} />
                          <span className="sr-only">Remove row</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={table.headers.length + 1} className="p-0 border border-border">
                      <Button
                        variant="ghost"
                        className="w-full h-8 rounded-none text-xs"
                        onClick={() => addTableRow(tableId)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Row
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={submitStaticFields} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Static Fields"
          )}
        </Button>
      </div>
    </div>
  )
}
