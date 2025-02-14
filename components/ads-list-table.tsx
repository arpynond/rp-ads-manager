"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteAdButton } from "./delete-ad-button"
import { EditAdButton } from "./edit-ad-button"
import { useAdsFilter } from "@/hooks/use-ads-filter"
import type { Ad, AdsGroup } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateAdType } from "@/utils/server-actions"

interface AdsListTableProps {
  initialAds: Ad[]
  adsGroups: AdsGroup[]
  initialGroupId: string
}

export function AdsListTable({ initialAds, adsGroups, initialGroupId }: AdsListTableProps) {
  const [ads, setAds] = useState(initialAds)
  const { selectedGroup } = useAdsFilter()
  const router = useRouter()

  useEffect(() => {
    if (selectedGroup === "all") {
      setAds(initialAds)
    } else {
      setAds(initialAds.filter((ad) => ad.ads_group_id === selectedGroup))
    }
  }, [selectedGroup, initialAds])

  useEffect(() => {
    const fixIncorrectTypes = async () => {
      for (const ad of ads) {
        const adsGroup = adsGroups.find((group) => group.id === ad.ads_group_id)
        if (adsGroup && ad.type !== adsGroup.ad_type) {
          try {
            await updateAdType(ad.id, ad.ads_group_id)
          } catch (error) {
            console.error("Error updating ad type:", error)
          }
        }
      }
    }

    fixIncorrectTypes()
  }, [ads, adsGroups])

  const sortedAndFilteredAds = useMemo(() => {
    const filteredAds = selectedGroup === "all" ? ads : ads.filter((ad) => ad.ads_group_id === selectedGroup)

    return filteredAds.sort((a, b) => {
      // 1. Sort by Ads group name
      const groupA = adsGroups.find((group) => group.id === a.ads_group_id)?.name || ""
      const groupB = adsGroups.find((group) => group.id === b.ads_group_id)?.name || ""

      if (groupA < groupB) return -1
      if (groupA > groupB) return 1

      // 2. Sort by Status (active, paused, archived)
      const statusOrder = { active: 0, paused: 1, archived: 2 }
      const statusCompare = statusOrder[a.status] - statusOrder[b.status]
      if (statusCompare !== 0) return statusCompare

      // 3. Sort by Name
      return a.name.localeCompare(b.name)
    })
  }, [ads, selectedGroup, adsGroups])

  const handleDeleteSuccess = (deletedId: string) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.id !== deletedId))
  }

  const handleDuplicateAd = async (ad: Ad) => {
    toast({
      title: "Not implemented",
      description: "Duplication functionality is not yet implemented.",
    })
  }

  if (sortedAndFilteredAds.length === 0) {
    return (
      <div>
        No ads found. {selectedGroup !== "all" ? "Create one to get started!" : "Select an Ads Group to create ads."}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Ads group</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAndFilteredAds.map((ad) => (
          <TableRow key={ad.id}>
            <TableCell className="font-medium">{ad.name}</TableCell>
            <TableCell>{adsGroups.find((group) => group.id === ad.ads_group_id)?.name || "Unknown"}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  ad.status === "active"
                    ? "bg-green-100 text-green-800"
                    : ad.status === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800",
                )}
              >
                {ad.status}
              </span>
            </TableCell>
            <TableCell>{ad.type}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditAdButton ad={ad} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicateAd(ad)}
                  title={`Duplicate ${ad.name}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <DeleteAdButton id={ad.id} name={ad.name} onDelete={() => handleDeleteSuccess(ad.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

