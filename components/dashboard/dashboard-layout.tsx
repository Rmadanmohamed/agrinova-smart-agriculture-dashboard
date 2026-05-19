"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  pageNumber?: string
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, pageNumber, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-52 flex-1">
        {pageNumber && title && subtitle && (
          <Header pageNumber={pageNumber} title={title} subtitle={subtitle} />
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
