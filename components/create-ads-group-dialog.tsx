"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdsGroupForm } from "./create-ads-group-form"
import { useState } from "react"
import type { AdsGroup } from "@/types/ads-group" // Import AdsGroup type

interface CreateAdsGroupDialogProps {
  onCreateSuccess: (newGroup: AdsGroup) => void
}

export function CreateAdsGroupDialog({ onCreateSuccess }: CreateAdsGroupDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Ads Group</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Ads Group</DialogTitle>
        </DialogHeader>
        <CreateAdsGroupForm
          mode="create"
          onSave={() => setOpen(false)}
          onCreateSuccess={(newGroup) => {
            onCreateSuccess(newGroup)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

