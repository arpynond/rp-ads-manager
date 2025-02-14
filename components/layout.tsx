import type React from "react"
import { MainLayout } from "./main-layout"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>
}

