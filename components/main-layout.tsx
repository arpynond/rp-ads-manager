"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Settings, Square, SquareStack, LinkIcon, LayoutDashboard, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Square className="h-6 w-6 text-blue-600" />
            RP Ads Manager
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <NavItem href="/" icon={LayoutDashboard} active={pathname === "/"}>
            Campaigns
          </NavItem>
          <NavItem href="/ads-groups" icon={SquareStack} active={pathname === "/ads-groups"}>
            Ads Groups
          </NavItem>
          <NavItem href="/ads" icon={Square} active={pathname === "/ads"}>
            Ads
          </NavItem>
          <NavItem href="/analytics" icon={BarChart3} active={pathname === "/analytics"}>
            Analytics
          </NavItem>
          <NavItem href="/integrations" icon={LinkIcon} active={pathname === "/integrations"}>
            Integrations
          </NavItem>
          <NavItem href="/documentation" icon={FileText} active={pathname === "/documentation"}>
            Documentation
          </NavItem>
          <NavItem href="/settings" icon={Settings} active={pathname === "/settings"}>
            Settings
          </NavItem>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 bg-gray-50 overflow-x-auto">
        <main className="p-8 min-w-0">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  active: boolean
}

function NavItem({ href, icon: Icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
      )}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  )
}

