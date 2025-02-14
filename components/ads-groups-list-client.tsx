"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditAdsGroupDialog } from "./edit-ads-group-dialog"
import { DeleteAdsGroupButton } from "./delete-ads-group-button"
import { Button } from "@/components/ui/button"
import { Plus, Copy, Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { AdsGroup, Campaign, Ad } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { getAds } from "@/utils/dataOperations"

interface AdsGroupsListClientProps {
  initialAdsGroups: AdsGroup[]
  campaigns: Campaign[]
}

export function AdsGroupsListClient({ initialAdsGroups, campaigns }: AdsGroupsListClientProps) {
  const router = useRouter()
  const [adsGroups, setAdsGroups] = useState(initialAdsGroups)
  const [adCounts, setAdCounts] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const fetchAdCounts = async () => {
      try {
        const ads = await getAds()
        const counts = ads.reduce((acc: { [key: string]: number }, ad: Ad) => {
          acc[ad.ads_group_id] = (acc[ad.ads_group_id] || 0) + 1
          return acc
        }, {})
        setAdCounts(counts)
      } catch (error) {
        console.error("Error fetching ad counts:", error)
        toast({
          title: "Error",
          description: "Failed to load ad counts",
          variant: "destructive",
        })
      }
    }

    fetchAdCounts()
  }, [])

  const handleUpdateSuccess = (updatedGroup: AdsGroup) => {
    setAdsGroups((prevGroups) => prevGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)))
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setAdsGroups((prevGroups) => prevGroups.filter((group) => group.id !== deletedId))
  }

  const handleDuplicateClick = async (group: AdsGroup) => {
    // Implement duplication logic here
    toast({
      title: "Not implemented",
      description: "Duplication functionality is not yet implemented.",
    })
  }

  if (adsGroups.length === 0) {
    return <div>No ads groups found. Create one to get started!</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Ad Type</TableHead>
          <TableHead>Device Type</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Target URL</TableHead>
          <TableHead>Campaign</TableHead>
          <TableHead>Ads Count</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adsGroups.map((group) => (
          <TableRow key={group.id}>
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell>{group.ad_type}</TableCell>
            <TableCell>{group.device_type}</TableCell>
            <TableCell>{group.template}</TableCell>
            <TableCell className="max-w-xs truncate">{group.target_url}</TableCell>
            <TableCell>
              {group.campaign_id
                ? campaigns.find((c) => c.id === group.campaign_id)?.name || "Not found"
                : "Not associated"}
            </TableCell>
            <TableCell>
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => router.push(`/ads/${group.id}`)}>
                {adCounts[group.id] || 0}
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditAdsGroupDialog group={group} campaigns={campaigns} onSave={handleUpdateSuccess}>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </EditAdsGroupDialog>
                <DeleteAdsGroupButton id={group.id} name={group.name} onDelete={() => handleDeleteSuccess(group.id)} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicateClick(group)}
                  title={`Duplicate ${group.name}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Link href={`/ads/${group.id}/new`} passHref>
                  <Button variant="outline" size="icon" title={`Add new ad to ${group.name}`}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

