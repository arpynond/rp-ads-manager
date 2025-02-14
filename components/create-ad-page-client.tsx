"use client"

import { useEffect, useState } from "react"
import { CreateAdForm } from "@/components/create-ad-form"
import { getAdsGroups } from "@/utils/dataOperations"
import type { AdsGroup } from "@/utils/dataOperations"
import { Loader } from "@/components/ui/loader"

interface CreateAdPageClientProps {
  groupId?: string
}

export function CreateAdPageClient({ groupId }: CreateAdPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adsGroups, setAdsGroups] = useState<AdsGroup[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch ads groups
        const fetchedAdsGroups = await getAdsGroups()

        if (!fetchedAdsGroups.length) {
          throw new Error("No ads groups found")
        }

        setAdsGroups(fetchedAdsGroups)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <Loader className="h-[50vh]" />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
      </div>
    )
  }

  const selectedGroup = groupId ? adsGroups.find((group) => group.id === groupId) : null

  if (groupId && !selectedGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Group Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The ads group you're trying to create an ad for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Ad</h1>
      <CreateAdForm mode="create" adsGroups={adsGroups} preSelectedAdsGroup={selectedGroup || undefined} />
    </div>
  )
}

