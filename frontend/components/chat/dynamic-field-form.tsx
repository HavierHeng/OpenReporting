"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DynamicFieldFormProps {
  fieldName: string
  fieldLabel: string
  onSubmit: (value: string) => void
}

export function DynamicFieldForm({ fieldName, fieldLabel, onSubmit }: DynamicFieldFormProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div className="space-y-2">
        <Textarea
          id={fieldName}
          placeholder={`Enter your ${fieldLabel.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-32"
        />
      </div>
      <Button type="submit">Submit {fieldLabel}</Button>
    </form>
  )
}
