import Link from "next/link"
import { BarChart3, Settings, Square, SquareStack } from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Square className="h-6 w-6 text-blue-600" />
            RP Ads Manager
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem href="/" icon={BarChart3}>
            Campaigns
          </NavItem>
          <NavItem href="/ads-groups" icon={SquareStack}>
            Ads Groups
          </NavItem>
          <NavItem href="/ads" icon={Square}>
            Ads
          </NavItem>
          <NavItem href="/analytics" icon={BarChart3}>
            Analytics
          </NavItem>
          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 bg-gray-50">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  children: React.ReactNode
}

function NavItem({ href, icon: Icon, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
      )}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  )
}

