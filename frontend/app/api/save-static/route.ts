import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Process the static fields
    console.log("Received static fields:", data)

    // Return next section info
    return NextResponse.json({
      section: "finances",
      message:
        "Now, let's gather information about your finances. Please provide details about your financial situation.",
    })
  } catch (error) {
    console.error("Error saving static fields:", error)
    return NextResponse.json({ error: "Failed to save static fields" }, { status: 500 })
  }
}
