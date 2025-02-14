"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Ad, type AdsGroup, getAds, getAdsGroups, duplicateAd } from "@/utils/dataOperations"
import { cn } from "@/lib/utils"
import { EditAdDialog } from "./edit-ad-dialog"
import { CreateAdDialog } from "./create-ad-dialog"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AdsListModalProps {
  isOpen: boolean
  onClose: () => void
  adsGroupId: string
  adsGroupName: string
}

export function AdsListModal({ isOpen, onClose, adsGroupId, adsGroupName }: AdsListModalProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [adsGroups, setAdsGroups] = useState<AdsGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [allAds, allAdsGroups] = await Promise.all([getAds(), getAdsGroups()])
        const filteredAds = allAds.filter((ad) => ad.adsGroupId === adsGroupId)
        setAds(filteredAds)
        setAdsGroups(allAdsGroups)
      } catch (error) {
        console.error("Error fetching ads:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen, adsGroupId])

  const handleAdUpdate = (updatedAd: Ad) => {
    setAds((prevAds) => prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)))
  }

  const handleCreateAdSuccess = (newAd: Ad) => {
    setAds((prevAds) => [...prevAds, newAd])
    setIsCreateAdModalOpen(false)
  }

  const handleDuplicateAd = async (ad: Ad) => {
    try {
      const duplicatedAd = await duplicateAd(ad.id)
      if (duplicatedAd) {
        setAds((prevAds) => [...prevAds, duplicatedAd])
        toast({
          title: "Success",
          description: `Ad "${duplicatedAd.name}" has been created with status "paused".`,
        })
      } else {
        throw new Error("Failed to duplicate Ad: Returned null")
      }
    } catch (error) {
      console.error("Error duplicating Ad:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to duplicate Ad. Please try again.",
        variant: "destructive",
      })
    }
  }

  const currentAdsGroup = adsGroups.find((group) => group.id === adsGroupId) || null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ads in {adsGroupName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>Loading ads...</div>
        ) : ads.length === 0 ? (
          <div>No ads found in this group.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditAdDialog ad={ad} adsGroups={adsGroups} onSave={handleAdUpdate} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateAd(ad)}
                        title={`Duplicate ${ad.name}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsCreateAdModalOpen(true)}>Add New Ad</Button>
        </div>
      </DialogContent>
      <CreateAdDialog
        isOpen={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        onCreateSuccess={handleCreateAdSuccess}
        adsGroups={adsGroups}
        preSelectedAdsGroup={currentAdsGroup}
      />
    </Dialog>
  )
}

