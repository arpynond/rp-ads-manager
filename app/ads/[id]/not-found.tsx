import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold mb-4">Ad Not Found</h2>
      <p className="text-muted-foreground mb-6">The ad you're looking for doesn't exist or has been removed.</p>
      <Button asChild>
        <Link href="/ads">Return to Ads</Link>
      </Button>
    </div>
  )
}

