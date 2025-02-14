"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

