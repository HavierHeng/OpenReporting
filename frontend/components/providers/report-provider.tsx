"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { saveStaticFields, sendChatMessage, nextSection } from "@/lib/api"

export type TableData = {
  [tableId: string]: {
    headers: string[]
    rows: string[][]
  }
}

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isSectionDivider?: boolean
  isFieldHeader?: boolean
}

export type DynamicField = {
  id: string
  label: string
  prompt: string
}

export type Section = "static" | "finances" | "market_analysis" | "future_outlook" | "executive_summary" | "complete"

export type ReportContextType = {
  configSelected: boolean
  setConfigSelected: (selected: boolean) => void
  messages: Message[]
  addMessage: (
    content: string,
    role: "user" | "assistant",
    options?: { isSectionDivider?: boolean; isFieldHeader?: boolean },
  ) => void
  staticFields: Record<string, any>
  updateStaticField: (key: string, value: any) => void
  tableData: TableData
  setTableData: (data: any) => void
  addTableRow: (tableId: string) => void
  addTableColumn: (tableId: string) => void
  removeTableRow: (tableId: string, index: number) => void
  removeTableColumn: (tableId: string, index: number) => void
  updateTableCell: (tableId: string, rowIndex: number, colIndex: number, value: string) => void
  updateTableHeader: (tableId: string, index: number, value: string) => void
  submitStaticFields: () => Promise<void>
  staticFieldsSubmitted: boolean
  currentSection: Section
  sendMessage: (message: string) => Promise<void>
  continueToNextSection: () => Promise<void>
  isLoading: boolean
  previewData: Record<string, any>
  reportTitle: string
  setReportTitle: (title: string) => void
  currentDynamicField: DynamicField | null
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
    items_table: {
      headers: ["Item", "Quantity", "Price"],
      rows: [["", "", ""]],
    },
  })
  const [staticFieldsSubmitted, setStaticFieldsSubmitted] = useState(false)
  const [currentSection, setCurrentSection] = useState<Section>("static")
  const [isLoading, setIsLoading] = useState(false)
  const [reportTitle, setReportTitle] = useState("Financial Report")
  const [currentDynamicField, setCurrentDynamicField] = useState<DynamicField | null>(null)

  // Combine all data for preview
  const previewData = {
    ...staticFields,
    items_table: tableData.items_table,
    finance_description:
      "Based on the financial data provided, the company shows a healthy growth trajectory with a 15% increase in revenue compared to the previous quarter. The cost structure remains stable, with a slight decrease in operational expenses.",
    market_analysis:
      currentSection === "market_analysis" ||
      currentSection === "future_outlook" ||
      currentSection === "executive_summary" ||
      currentSection === "complete"
        ? "The market shows positive signs of recovery after the recent economic downturn. Competitors are focusing on digital transformation, creating both challenges and opportunities for our business model."
        : "",
    future_outlook:
      currentSection === "future_outlook" || currentSection === "executive_summary" || currentSection === "complete"
        ? "Based on current trends and financial indicators, we project continued growth in the next two quarters. Key areas for investment include expanding the digital product line and strengthening customer retention programs."
        : "",
    executive_summary:
      currentSection === "complete"
        ? "This report highlights the strong financial performance of the company despite challenging market conditions. With strategic investments in key growth areas and a focus on operational efficiency, the company is well-positioned for sustainable growth in the coming year."
        : "",
  }

  const addMessage = (
    content: string,
    role: "user" | "assistant",
    options?: { isSectionDivider?: boolean; isFieldHeader?: boolean },
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      isSectionDivider: options?.isSectionDivider || false,
      isFieldHeader: options?.isFieldHeader || false,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const updateStaticField = (key: string, value: any) => {
    setStaticFields((prev) => ({ ...prev, [key]: value }))
  }

  const addTableRow = (tableId: string) => {
    setTableData((prev) => {
      if (!prev[tableId]) return prev

      return {
        ...prev,
        [tableId]: {
          ...prev[tableId],
          rows: [...prev[tableId].rows, Array(prev[tableId].headers.length).fill("")],
        },
      }
    })
  }

  const addTableColumn = (tableId: string) => {
    setTableData((prev) => {
      if (!prev[tableId]) return prev

      return {
        ...prev,
        [tableId]: {
          headers: [...prev[tableId].headers, ""],
          rows: prev[tableId].rows.map((row) => [...row, ""]),
        },
      }
    })
  }

  const removeTableRow = (tableId: string, index: number) => {
    setTableData((prev) => {
      if (!prev[tableId] || prev[tableId].rows.length <= 1) return prev

      return {
        ...prev,
        [tableId]: {
          ...prev[tableId],
          rows: prev[tableId].rows.filter((_, i) => i !== index),
        },
      }
    })
  }

  const removeTableColumn = (tableId: string, index: number) => {
    setTableData((prev) => {
      if (!prev[tableId] || prev[tableId].headers.length <= 1) return prev

      return {
        ...prev,
        [tableId]: {
          headers: prev[tableId].headers.filter((_, i) => i !== index),
          rows: prev[tableId].rows.map((row) => row.filter((_, i) => i !== index)),
        },
      }
    })
  }

  const updateTableCell = (tableId: string, rowIndex: number, colIndex: number, value: string) => {
    setTableData((prev) => {
      if (!prev[tableId]) return prev

      const newRows = [...prev[tableId].rows]
      if (!newRows[rowIndex]) return prev

      newRows[rowIndex] = [...newRows[rowIndex]]
      newRows[rowIndex][colIndex] = value

      return {
        ...prev,
        [tableId]: {
          ...prev[tableId],
          rows: newRows,
        },
      }
    })
  }

  const updateTableHeader = (tableId: string, index: number, value: string) => {
    setTableData((prev) => {
      if (!prev[tableId]) return prev

      return {
        ...prev,
        [tableId]: {
          ...prev[tableId],
          headers: prev[tableId].headers.map((header, i) => (i === index ? value : header)),
        },
      }
    })
  }

  const submitStaticFields = async () => {
    setIsLoading(true)
    try {
      // Prepare data to send
      const data = {
        ...staticFields,
        items_table: tableData.items_table,
      }

      // Add a divider message
      addMessage("Static Fields Submitted", "assistant", { isSectionDivider: true })

      // Call API
      const response = await saveStaticFields(data)

      // Update state
      setStaticFieldsSubmitted(true)
      setCurrentSection("finances")

      // Set current dynamic field
      setCurrentDynamicField({
        id: "finance_description",
        label: "Financial Description",
        prompt: response.message,
      })

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
        setCurrentDynamicField({
          id: "market_analysis",
          label: "Market Analysis",
          prompt: response.message,
        })
      } else if (response.section === "future_outlook") {
        setCurrentSection("future_outlook")
        setCurrentDynamicField({
          id: "future_outlook",
          label: "Future Outlook",
          prompt: response.message,
        })
      } else if (response.section === "executive_summary") {
        setCurrentSection("executive_summary")
        setCurrentDynamicField(null)
      } else if (response.section === "complete") {
        setCurrentSection("complete")
        setCurrentDynamicField(null)
      }

      // Add section divider
      addMessage(`${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Completed`, "assistant", {
        isSectionDivider: true,
      })

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
        setTableData,
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
        previewData,
        reportTitle,
        setReportTitle,
        currentDynamicField,
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
