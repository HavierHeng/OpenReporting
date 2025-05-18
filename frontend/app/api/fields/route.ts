import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get config ID from URL
    const { searchParams } = new URL(request.url)
    const configId = searchParams.get("config")

    // Return static fields based on config
    return NextResponse.json({
      fields: [
        {
          id: "client_name",
          type: "text",
          label: "Client Name",
          placeholder: "Enter client name",
          help: "Full name of the client",
        },
        {
          id: "report_date",
          type: "date",
          label: "Report Date",
          value: "2025-05-19",
          help: "Date of the report (YYYY-MM-DD)",
        },
        {
          id: "items_table",
          type: "table",
          label: "Items Table",
          headers: ["Item", "Quantity", "Price"],
          rows: [["", "", ""]],
        },
      ],
    })
  } catch (error) {
    console.error("Error fetching fields:", error)
    return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 })
  }
}
