"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error)
  }, [error])

  const isEnvError = error.message.includes("environment variables")
  const errorMessage = isEnvError
    ? "Missing required environment variables. Please check your configuration."
    : error.message || "An unexpected error occurred"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        {isEnvError ? (
          <div className="text-sm text-muted-foreground">
            <p>Make sure you have set up the following environment variables:</p>
            <ul className="mt-2 space-y-1 font-mono">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            <Button variant="outline" onClick={() => reset()}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

