"use client"

import { useEffect, useState } from "react"
import { CreateAdForm } from "@/components/create-ad-form"
import { getAd, getAdsGroups } from "@/utils/dataOperations"
import type { Ad, AdsGroup } from "@/utils/dataOperations"
import { Loader } from "@/components/ui/loader"

interface AdPageClientProps {
  id: string
  groupId: string
}

export function AdPageClient({ id, groupId }: AdPageClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ad, setAd] = useState<Ad | null>(null)
  const [adsGroups, setAdsGroups] = useState<AdsGroup[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch data
        const [fetchedAd, fetchedAdsGroups] = await Promise.all([getAd(id), getAdsGroups()])

        if (!fetchedAd || !fetchedAdsGroups.length) {
          throw new Error("Data not found")
        }

        const selectedGroup = fetchedAdsGroups.find((group) => group.id === groupId)
        if (!selectedGroup) {
          throw new Error("Group not found")
        }

        setAd(fetchedAd)
        setAdsGroups(fetchedAdsGroups)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, groupId])

  if (isLoading) {
    return <Loader className="h-[50vh]" />
  }

  if (error || !ad || !adsGroups.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Ad Not Found</h2>
        <p className="text-muted-foreground mb-6">The ad you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  const selectedGroup = adsGroups.find((group) => group.id === groupId)
  if (!selectedGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Group Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The ads group you're looking for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>
      <CreateAdForm
        mode="edit"
        initialData={ad}
        adsGroups={adsGroups}
        preSelectedAdsGroup={selectedGroup}
        isStatusDisabled={ad.status === "archived"}
      />
    </div>
  )
}

