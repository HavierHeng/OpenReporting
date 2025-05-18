"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

interface MainNavProps {
  onMenuClick: () => void
}

export function MainNav({ onMenuClick }: MainNavProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onMenuClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex items-center">
        <span className="text-primary font-bold text-2xl mr-2">O</span>
        <span className="font-semibold text-xl">OpenReporting</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  )
}
