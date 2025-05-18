"use client"

import { useReportContext } from "@/components/providers/report-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

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
  } = useReportContext()

  return (
    <div className="bg-card border rounded-lg p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Static Fields</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            value={staticFields.client_name || ""}
            onChange={(e) => updateStaticField("client_name", e.target.value)}
            placeholder="Enter client name"
          />
          <p className="text-sm text-muted-foreground">Full name of the client</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report_date">Report Date</Label>
          <Input
            id="report_date"
            type="date"
            value={staticFields.report_date || "2025-05-19"}
            onChange={(e) => updateStaticField("report_date", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Date of the report (YYYY-MM-DD)</p>
        </div>

        <div className="space-y-2">
          <Label>Items Table</Label>

          <div className="border rounded-lg overflow-hidden">
            <table className="editable-table">
              <thead>
                <tr>
                  {tableData.headers.map((header, index) => (
                    <th key={index}>
                      <Input
                        value={header}
                        onChange={(e) => updateTableHeader(index, e.target.value)}
                        placeholder="Column name"
                        className="border-0 bg-transparent"
                      />
                    </th>
                  ))}
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => updateTableCell(rowIndex, cellIndex, e.target.value)}
                          placeholder="Enter value"
                          className="border-0 bg-transparent"
                        />
                      </td>
                    ))}
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => removeTableRow(rowIndex)}
                        disabled={tableData.rows.length <= 1}
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
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span className="sr-only">Remove row</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-2">
            <button type="button" className="add-button" onClick={addTableRow}>
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
                className="mr-1"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Row
            </button>

            <button type="button" className="add-button" onClick={addTableColumn}>
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
                className="mr-1"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Column
            </button>
          </div>
        </div>
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
