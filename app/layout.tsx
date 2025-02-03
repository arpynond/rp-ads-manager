import { Layout } from "@/components/layout"
import { ClientInit } from "@/components/client-init"
import { AttributeCleaner } from "@/components/attribute-cleaner"
import "@/styles/globals.css"
import type React from "react"

export const metadata = {
  title: "RP Ads Manager",
  description: "Manage your ad campaigns efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AttributeCleaner />
        <ClientInit />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}



import './globals.css'