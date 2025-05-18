"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { saveStaticFields, sendChatMessage, nextSection } from "@/lib/api"

export type TableData = {
  headers: string[]
  rows: string[][]
}

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export type Section = "static" | "finances" | "market_analysis" | "executive_summary" | "complete"

export type ReportContextType = {
  configSelected: boolean
  setConfigSelected: (selected: boolean) => void
  messages: Message[]
  addMessage: (content: string, role: "user" | "assistant") => void
  staticFields: Record<string, any>
  updateStaticField: (key: string, value: any) => void
  tableData: TableData
  addTableRow: () => void
  addTableColumn: () => void
  removeTableRow: (index: number) => void
  removeTableColumn: (index: number) => void
  updateTableCell: (rowIndex: number, colIndex: number, value: string) => void
  updateTableHeader: (index: number, value: string) => void
  submitStaticFields: () => Promise<void>
  staticFieldsSubmitted: boolean
  currentSection: Section
  sendMessage: (message: string) => Promise<void>
  continueToNextSection: () => Promise<void>
  isLoading: boolean
}

const ReportContext = createContext<ReportContextType | undefined>(undefined)

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [configSelected, setConfigSelected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello, I am OpenReporting, and I am here to assist you with making your report. Please select a config to begin.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [staticFields, setStaticFields] = useState<Record<string, any>>({})
  const [tableData, setTableData] = useState<TableData>({
    headers: ["Item", "Quantity", "Price"],
    rows: [["", "", ""]],
  })
  const [staticFieldsSubmitted, setStaticFieldsSubmitted] = useState(false)
  const [currentSection, setCurrentSection] = useState<Section>("static")
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const updateStaticField = (key: string, value: any) => {
    setStaticFields((prev) => ({ ...prev, [key]: value }))
  }

  const addTableRow = () => {
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, Array(prev.headers.length).fill("")],
    }))
  }

  const addTableColumn = () => {
    setTableData((prev) => ({
      headers: [...prev.headers, ""],
      rows: prev.rows.map((row) => [...row, ""]),
    }))
  }

  const removeTableRow = (index: number) => {
    if (tableData.rows.length > 1) {
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.filter((_, i) => i !== index),
      }))
    }
  }

  const removeTableColumn = (index: number) => {
    if (tableData.headers.length > 1) {
      setTableData((prev) => ({
        headers: prev.headers.filter((_, i) => i !== index),
        rows: prev.rows.map((row) => row.filter((_, i) => i !== index)),
      }))
    }
  }

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    setTableData((prev) => {
      const newRows = [...prev.rows]
      newRows[rowIndex] = [...newRows[rowIndex]]
      newRows[rowIndex][colIndex] = value
      return { ...prev, rows: newRows }
    })
  }

  const updateTableHeader = (index: number, value: string) => {
    setTableData((prev) => ({
      ...prev,
      headers: prev.headers.map((header, i) => (i === index ? value : header)),
    }))
  }

  const submitStaticFields = async () => {
    setIsLoading(true)
    try {
      // Prepare data to send
      const data = {
        ...staticFields,
        items_table: tableData,
      }

      // Add a divider message
      addMessage("Static Fields Submitted", "assistant")

      // Call API
      const response = await saveStaticFields(data)

      // Update state
      setStaticFieldsSubmitted(true)
      setCurrentSection("finances")

      // Add the next message
      addMessage(response.message, "assistant")
    } catch (error) {
      console.error("Error submitting static fields:", error)
      addMessage("There was an error submitting the static fields. Please try again.", "assistant")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (message: string) => {
    setIsLoading(true)
    try {
      // Add user message
      addMessage(message, "user")

      // Call API
      const response = await sendChatMessage(message)

      // Add response
      addMessage(response.message, "assistant")
    } catch (error) {
      console.error("Error sending message:", error)
      addMessage("There was an error processing your message. Please try again.", "assistant")
    } finally {
      setIsLoading(false)
    }
  }

  const continueToNextSection = async () => {
    setIsLoading(true)
    try {
      // Call API
      const response = await nextSection(currentSection)

      // Update section
      if (response.section === "market_analysis") {
        setCurrentSection("market_analysis")
      } else if (response.section === "executive_summary") {
        setCurrentSection("executive_summary")
      } else if (response.section === "complete") {
        setCurrentSection("complete")
      }

      // Add section divider
      addMessage(`${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Completed`, "assistant")

      // Add the next message
      addMessage(response.message, "assistant")
    } catch (error) {
      console.error("Error continuing to next section:", error)
      addMessage("There was an error moving to the next section. Please try again.", "assistant")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ReportContext.Provider
      value={{
        configSelected,
        setConfigSelected,
        messages,
        addMessage,
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
        staticFieldsSubmitted,
        currentSection,
        sendMessage,
        continueToNextSection,
        isLoading,
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export function useReportContext() {
  const context = useContext(ReportContext)
  if (context === undefined) {
    throw new Error("useReportContext must be used within a ReportProvider")
  }
  return context
}
