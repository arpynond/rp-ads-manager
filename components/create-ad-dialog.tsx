"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateAdForm } from "./create-ad-form"
import type { Ad, AdsGroup } from "@/utils/dataOperations"

interface CreateAdDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateSuccess: (newAd: Ad) => void
  adsGroups: AdsGroup[]
  preSelectedAdsGroup?: AdsGroup | null
}

export function CreateAdDialog({
  isOpen,
  onClose,
  onCreateSuccess,
  adsGroups,
  preSelectedAdsGroup,
}: CreateAdDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Ad</DialogTitle>
        </DialogHeader>
        <CreateAdForm
          mode="create"
          onSave={onCreateSuccess}
          adsGroups={adsGroups}
          preSelectedAdsGroup={preSelectedAdsGroup}
        />
      </DialogContent>
    </Dialog>
  )
}

