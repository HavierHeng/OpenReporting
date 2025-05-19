"use client"

import { cn } from "@/lib/utils"

interface FieldBannerProps {
  fieldName: string
  className?: string
}

export function FieldBanner({ fieldName, className }: FieldBannerProps) {
  return (
    <div
      className={cn(
        "w-full py-2 px-4 bg-primary/10 text-primary rounded-md text-center text-sm font-medium my-4",
        className,
      )}
    >
      ------ Gathering information on "{fieldName}" ------
    </div>
  )
}
