"use client"

import { useEffect, useState } from "react"
import { CampaignForm } from "@/components/campaign-form"
import { getCampaign } from "@/utils/dataOperations"
import type { Campaign } from "@/utils/dataOperations"
import { Loader } from "@/components/ui/loader"

interface CampaignPageClientProps {
  id: string
}

export function CampaignPageClient({ id }: CampaignPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch campaign
        const fetchedCampaign = await getCampaign(id)
        if (!fetchedCampaign) {
          throw new Error("Campaign not found")
        }

        setCampaign(fetchedCampaign)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return <Loader className="h-[50vh]" />
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>
      <CampaignForm mode="edit" initialData={campaign} />
    </div>
  )
}

