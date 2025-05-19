"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserFlowDiagram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mermaid-wrapper">
          {/* This is a placeholder for a mermaid diagram - in a real app, you'd use a mermaid renderer */}
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {`graph TD
    Start[Start] --> SelectConfig[Select Config]
    SelectConfig --> StaticFields[Fill Static Fields]
    StaticFields --> SubmitStatic[Submit Static Fields]
    
    SubmitStatic --> DynamicField1[Dynamic Field: Finances]
    DynamicField1 --> Chat1[Chat about Finances]
    Chat1 --> ConfirmField1[Confirm Field]
    
    ConfirmField1 --> DynamicField2[Dynamic Field: Market Analysis]
    DynamicField2 --> Chat2[Chat about Market Analysis]
    Chat2 --> ConfirmField2[Confirm Field]
    
    ConfirmField2 --> Summary[Generate Executive Summary]
    Summary --> Preview[Preview Report]
    Preview --> Download[Download Report]
    
    SelectConfig -- "Reuse Previous" --> LoadPrevious[Load Previous Report Data]
    LoadPrevious --> StaticFields
    
    style Start fill:#f9fafb,color:#000
    style SelectConfig fill:#6366f1,color:#fff
    style StaticFields fill:#4f46e5,color:#fff
    style SubmitStatic fill:#4338ca,color:#fff
    style DynamicField1 fill:#3730a3,color:#fff
    style Chat1 fill:#312e81,color:#fff
    style ConfirmField1 fill:#1e3a8a,color:#fff
    style DynamicField2 fill:#1e40af,color:#fff
    style Chat2 fill:#1e3a8a,color:#fff
    style ConfirmField2 fill:#1e3a8a,color:#fff
    style Summary fill:#1e3a8a,color:#fff
    style Preview fill:#1e3a8a,color:#fff
    style Download fill:#1e3a8a,color:#fff
    style LoadPrevious fill:#4f46e5,color:#fff`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
