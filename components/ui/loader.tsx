import type React from "react"
import { Loader2 } from "lucide-react"

export function Loader({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium text-muted-foreground">Loading...</span>
    </div>
  )
}

