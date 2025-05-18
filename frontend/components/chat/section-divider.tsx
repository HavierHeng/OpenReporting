import type React from "react"
interface SectionDividerProps {
  children: React.ReactNode
}

export function SectionDivider({ children }: SectionDividerProps) {
  return (
    <div className="section-divider">
      <span className="section-divider-text">{children}</span>
    </div>
  )
}
