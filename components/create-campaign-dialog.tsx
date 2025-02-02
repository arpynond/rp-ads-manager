"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from "./create-campaign-form"
import { useState } from "react"
import type { Campaign } from "@/utils/dataOperations"

interface CreateCampaignDialogProps {
  onCreateSuccess: (newCampaign: Campaign) => void
}

export function CreateCampaignDialog({ onCreateSuccess }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Campaign</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <CreateCampaignForm
          mode="create"
          onSave={() => setOpen(false)}
          onCreateSuccess={(newCampaign) => {
            onCreateSuccess(newCampaign)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

