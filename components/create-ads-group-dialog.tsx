"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdsGroupForm } from "./create-ads-group-form"
import { useState } from "react"
import type { AdsGroup, Campaign } from "@/types"
import { useRouter } from "next/navigation"

interface CreateAdsGroupDialogProps {
  campaigns: Campaign[]
}

export function CreateAdsGroupDialog({ campaigns }: CreateAdsGroupDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCreateSuccess = (newGroup: AdsGroup) => {
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Ads Group</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background pt-6 pb-4 mb-4">
          <DialogTitle>Create New Ads Group</DialogTitle>
        </DialogHeader>
        <CreateAdsGroupForm mode="create" onSave={handleCreateSuccess} campaigns={campaigns} />
      </DialogContent>
    </Dialog>
  )
}

