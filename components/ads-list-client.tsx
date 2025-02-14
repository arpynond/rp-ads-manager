"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteAdButton } from "./delete-ad-button"
import { EditAdDialog } from "./edit-ad-dialog"
import type { Ad, AdsGroup } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdsListClientProps {
  initialAds: Ad[]
  adsGroups: AdsGroup[]
  showControls: boolean
}

export function AdsListClient({ initialAds, adsGroups, showControls }: AdsListClientProps) {
  const [ads, setAds] = useState(initialAds)
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  const filteredAds = useMemo(() => {
    return selectedGroup === "all" ? ads : ads.filter((ad) => ad.ads_group_id === selectedGroup)
  }, [ads, selectedGroup])

  const handleUpdateSuccess = (updatedAd: Ad) => {
    setAds((prevAds) => prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)))
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.id !== deletedId))
  }

  const handleDuplicateAd = async (ad: Ad) => {
    toast({
      title: "Not implemented",
      description: "Duplication functionality is not yet implemented.",
    })
  }

  if (showControls) {
    return (
      <div className="flex items-center gap-4">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px]">
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
        {selectedGroup !== "all" && (
          <Link href={`/ads/${selectedGroup}/new`} passHref>
            <Button>Add New Ad</Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      {filteredAds.length === 0 ? (
        <div>
          No ads found. {selectedGroup !== "all" ? "Create one to get started!" : "Select an Ads Group to create ads."}
        </div>
      ) : (
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
            {filteredAds.map((ad) => (
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
                    <EditAdDialog ad={ad} adsGroups={adsGroups} onSave={handleUpdateSuccess} />
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
      )}
    </div>
  )
}

