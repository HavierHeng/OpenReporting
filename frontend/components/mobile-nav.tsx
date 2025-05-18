"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  onHistoryClick: () => void
}

export function MobileNav({ onHistoryClick }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-background border-t py-2">
      <div className="flex justify-around">
        <NavItem
          href="/"
          active={pathname === "/"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
        >
          Home
        </NavItem>

        <NavItem
          href="/chatbot"
          active={pathname === "/chatbot"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        >
          Chatbot
        </NavItem>

        <NavItem
          href="/config"
          active={pathname === "/config"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          }
        >
          Config
        </NavItem>

        <button onClick={onHistoryClick} className="flex flex-col items-center px-3 py-1 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
        </button>
      </div>
    </nav>
  )
}

interface NavItemProps {
  href: string
  active: boolean
  icon: React.ReactNode
  children: React.ReactNode
}

function NavItem({ href, active, icon, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn("flex flex-col items-center px-3 py-1 text-xs", active ? "text-primary" : "text-muted-foreground")}
    >
      <span className="mb-1">{icon}</span>
      {children}
    </Link>
  )
}
