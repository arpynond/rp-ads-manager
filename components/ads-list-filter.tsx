"use client"

import { useEffect } from "react"
import { useAdsFilter } from "@/hooks/use-ads-filter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import type { AdsGroup, Campaign } from "@/types"
import { EditAdsGroupDialogAdsPage } from "./edit-ads-group-dialog-ads-page"
import { useRouter } from "next/navigation"

interface AdsListFilterProps {
  adsGroups: AdsGroup[]
  campaigns: Campaign[]
}

export function AdsListFilter({ adsGroups, campaigns }: AdsListFilterProps) {
  const { selectedGroup, setSelectedGroup } = useAdsFilter()
  const router = useRouter()

  // Validate props
  useEffect(() => {
    if (!Array.isArray(campaigns)) {
      console.error("Campaigns prop is not an array:", campaigns)
    }
    if (!Array.isArray(adsGroups)) {
      console.error("AdsGroups prop is not an array:", adsGroups)
    }
  }, [campaigns, adsGroups])

  const selectedAdsGroup = adsGroups.find((group) => group.id === selectedGroup)

  const handleEditSuccess = (updatedGroup: AdsGroup) => {
    router.refresh()
  }

  // Ensure we have valid data before rendering
  if (!Array.isArray(campaigns) || !Array.isArray(adsGroups)) {
    return null // Or render an error state
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
        <SelectTrigger className="min-w-[180px] w-fit max-w-[400px] [&>span]:mr-2">
          <SelectValue placeholder="All Ads Groups" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ads Groups</SelectItem>
          {adsGroups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedGroup !== "all" && selectedAdsGroup && (
        <>
          <EditAdsGroupDialogAdsPage group={selectedAdsGroup} campaigns={campaigns} onSave={handleEditSuccess}>
            <Button variant="outline">Edit Ads Group</Button>
          </EditAdsGroupDialogAdsPage>
          <Link href={`/ads/${selectedGroup}/new`} passHref>
            <Button>Add New Ad</Button>
          </Link>
        </>
      )}
    </div>
  )
}

