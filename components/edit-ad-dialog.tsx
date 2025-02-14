"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateAdForm } from "./create-ad-form"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { type Ad, type AdsGroup, updateAd } from "@/utils/dataOperations"

interface EditAdDialogProps {
  ad: Ad
  adsGroups: AdsGroup[]
  onSave: (updatedAd: Ad) => void
}

export function EditAdDialog({ ad, adsGroups, onSave }: EditAdDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = async (updatedAd: Ad) => {
    try {
      const savedAd = await updateAd(ad.id, updatedAd)
      if (savedAd) {
        onSave(savedAd)
        setIsOpen(false)
        toast({
          title: "Success",
          description: "Ad updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating ad:", error)
      toast({
        title: "Error",
        description: "Failed to update ad. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Ad</DialogTitle>
          </DialogHeader>
          <CreateAdForm
            initialData={ad}
            mode="edit"
            onSave={handleSave}
            adsGroups={adsGroups}
            preSelectedAdsGroup={adsGroups.find((group) => group.id === ad.ads_group_id) || null}
            isStatusDisabled={ad.status === "archived"}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

