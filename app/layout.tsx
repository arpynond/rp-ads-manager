import { Layout } from "@/components/layout"
import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"
import type React from "react"

export const metadata = {
  title: "RP Ads Manager",
  description: "Manage your ad campaigns efficiently",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'