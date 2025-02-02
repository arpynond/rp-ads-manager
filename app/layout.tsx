import { Layout } from "@/components/layout"
import { ClientInit } from "@/components/client-init"
import "@/styles/globals.css"
import type React from "react" // Added import for React

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
        <ClientInit />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}



import './globals.css'