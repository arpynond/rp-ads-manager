"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdsGroupForm } from "./create-ads-group-form"
import type { AdsGroup, Campaign } from "@/types"
import { toast } from "@/components/ui/use-toast"

interface EditAdsGroupDialogAdsPageProps {
  group: AdsGroup
  campaigns: Campaign[]
  onSave: (updatedGroup: AdsGroup) => void
  children?: ReactNode
}

export function EditAdsGroupDialogAdsPage({
  group,
  campaigns = [], // Provide default empty array
  onSave,
  children,
}: EditAdsGroupDialogAdsPageProps) {
  const [open, setOpen] = useState(false)

  // Validate props when dialog opens
  useEffect(() => {
    if (open && !Array.isArray(campaigns)) {
      console.error("Campaigns prop is not an array:", campaigns)
      setOpen(false)
      toast({
        title: "Error",
        description: "Could not load campaigns data. Please try again.",
        variant: "destructive",
      })
    }
  }, [open, campaigns])

  const handleSave = async (updatedGroup: AdsGroup) => {
    try {
      onSave(updatedGroup)
      setOpen(false)
      toast({
        title: "Success",
        description: "Ads Group updated successfully",
      })
    } catch (error) {
      console.error("Error updating Ads Group:", error)
      toast({
        title: "Error",
        description: "Failed to update Ads Group. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Only allow opening if campaigns is valid
        if (newOpen && !Array.isArray(campaigns)) {
          console.error("Cannot open dialog: campaigns prop is not an array")
          toast({
            title: "Error",
            description: "Could not load campaigns data. Please try again.",
            variant: "destructive",
          })
          return
        }
        setOpen(newOpen)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ads Group</DialogTitle>
        </DialogHeader>
        <CreateAdsGroupForm mode="edit" initialData={group} onSave={handleSave} campaigns={campaigns} />
      </DialogContent>
    </Dialog>
  )
}

