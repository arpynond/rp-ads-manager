import { AnalyticsTable } from "@/components/analytics-table"
import { fetchAnalyticsData } from "@/utils/server-actions"
import { Suspense } from "react"
import { Loader } from "@/components/ui/loader"

export default async function AnalyticsPage() {
  return (
    <div>
      <Suspense fallback={<Loader className="h-[50vh]" />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}

async function AnalyticsContent() {
  try {
    const analyticsData = await fetchAnalyticsData()

    if (analyticsData.length === 0) {
      return (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          <div className="rounded-md border border-dashed p-8 text-center">
            <h2 className="text-lg font-semibold mb-2">No analytics data available</h2>
            <p className="text-muted-foreground mb-4">
              Analytics data will appear here once your campaigns start generating activity.
            </p>
            <p className="text-sm text-muted-foreground">
              Make sure your analytics table is properly set up in your database.
            </p>
          </div>
        </div>
      )
    }

    return <AnalyticsTable initialData={analyticsData} />
  } catch (error) {
    return (
      <div className="rounded-md border border-destructive p-8 text-center">
        <h2 className="text-lg font-semibold mb-2">Unable to load analytics</h2>
        <p className="text-muted-foreground">There was an error loading the analytics data. Please try again later.</p>
      </div>
    )
  }
}

