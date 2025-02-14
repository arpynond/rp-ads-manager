"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface StopCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  campaignName: string
}

export function StopCampaignModal({ isOpen, onClose, onConfirm, campaignName }: StopCampaignModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Campaign Stop</DialogTitle>
          <DialogDescription>
            Are you sure you want to stop the campaign "{campaignName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Stop Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

