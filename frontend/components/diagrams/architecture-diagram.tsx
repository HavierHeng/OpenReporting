"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ArchitectureDiagram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mermaid-wrapper">
          {/* This is a placeholder for a mermaid diagram - in a real app, you'd use a mermaid renderer */}
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {`graph TD
    User[User] --> Frontend[Frontend: Next.js + React]
    Frontend --> CoreAPI[Core API]
    Frontend --> DocxPreview[Docx Preview Microservice]
    
    CoreAPI --> TemplateEngine[Template Engine]
    CoreAPI --> ChatBackend[Chat Backend]
    CoreAPI --> DB[(SQLite3 DB)]
    
    ChatBackend --> LLM[LLM Provider]
    ChatBackend --> RAG[Optional RAG Engine]
    
    TemplateEngine --> DocxOutput[Docx Output]
    
    subgraph "Frontend Components"
        Dashboard[Dashboard]
        Chatbot[Chatbot Interface]
        ConfigEditor[YAML Config Editor]
        Settings[Settings]
    end
    
    subgraph "Backend Services"
        JWT[JWT Auth]
        FieldProcessor[Field Processor]
        Validator[Validator Agents]
    end
    
    style Frontend fill:#6366f1,color:#fff
    style CoreAPI fill:#4f46e5,color:#fff
    style ChatBackend fill:#4338ca,color:#fff
    style TemplateEngine fill:#3730a3,color:#fff
    style DocxPreview fill:#312e81,color:#fff
    style RAG fill:#1e3a8a,color:#fff
    style User fill:#f9fafb,color:#000
    style LLM fill:#1e40af,color:#fff
    style DB fill:#1e3a8a,color:#fff
    style DocxOutput fill:#1e3a8a,color:#fff`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
